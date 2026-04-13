import { useState, useRef, useCallback } from 'react'
import type { Phase, FileTransfer, ReceivedFile } from '../types'

const CHUNK_SIZE = 16_384

// Vite proxies /ws → http://localhost:8080/ws (including WebSocket upgrades).
// Override with VITE_SIGNALING_URL in .env.local for production or non-proxied setups.
const SIGNALING_URL = (import.meta.env.VITE_SIGNALING_URL as string | undefined)
  ?? `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`

type SignalingMsg =
  | { type: 'waiting' }
  | { type: 'ready'; role: 'initiator' | 'responder' }
  | { type: 'sdp'; payload: RTCSessionDescriptionInit }
  | { type: 'peer_left' }
  | { type: 'error'; message: string }

function awaitIceGathering(pc: RTCPeerConnection): Promise<void> {
  return new Promise(resolve => {
    if (pc.iceGatheringState === 'complete') { resolve(); return }
    const onchange = () => {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', onchange)
        resolve()
      }
    }
    pc.addEventListener('icegatheringstatechange', onchange)
  })
}

export interface UseWebRTCFileShare{
   phase: Phase;
   transfer: FileTransfer | null;
   receivedFiles: ReceivedFile[];
   error: string | null;
   connect: ()=>void;
   sendFile: (file: File)=>void;
   reset: ()=>void;
}


export const useWebRTCFileShare = (sessionId: string): UseWebRTCFileShare => {
  const [phase, setPhase] = useState<Phase>('idle')
  const [transfer, setTransfer] = useState<FileTransfer | null>(null)
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([])
  const [error, setError] = useState<string | null>(null)

  // phaseRef mirrors phase so WS callbacks don't capture a stale closure value.
  const phaseRef = useRef<Phase>('idle')
  const wsRef = useRef<WebSocket | null>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const channelRef = useRef<RTCDataChannel | null>(null)

  // Receive-side accumulation buffers
  const rxBufRef = useRef<ArrayBuffer[]>([])
  const rxMetaRef = useRef<{ name: string; size: number } | null>(null)
  const rxSizeRef = useRef(0)

  const updatePhase = useCallback((p: Phase) => {
    phaseRef.current = p
    setPhase(p)
  }, [])

  const newPC = useCallback(() => {
    const pc = new RTCPeerConnection()
    pcRef.current = pc
    pc.addEventListener('connectionstatechange', () => {
      if (pc.connectionState === 'connected') updatePhase('connected')
      if (pc.connectionState === 'failed') {
        setError('WebRTC connection failed.')
        updatePhase('failed')
      }
    })
    return pc
  }, [updatePhase])

  const attachChannel = useCallback((ch: RTCDataChannel) => {
    channelRef.current = ch
    ch.binaryType = 'arraybuffer'
    ch.addEventListener('message', (ev: MessageEvent) => {
      if (typeof ev.data === 'string') {
        const meta = JSON.parse(ev.data as string) as { name: string; size: number }
        rxMetaRef.current = meta
        rxBufRef.current = []
        rxSizeRef.current = 0
        setTransfer({ name: meta.name, size: meta.size, transferred: 0, direction: 'receiving', done: false })
      } else {
        const chunk = ev.data as ArrayBuffer
        rxBufRef.current.push(chunk)
        rxSizeRef.current += chunk.byteLength
        setTransfer(prev => prev ? { ...prev, transferred: rxSizeRef.current } : null)
        const meta = rxMetaRef.current
        if (meta && rxSizeRef.current >= meta.size) {
          const url = URL.createObjectURL(new Blob(rxBufRef.current))
          setReceivedFiles(prev => [
            ...prev,
            { id: crypto.randomUUID(), name: meta.name, url, size: meta.size },
          ])
          setTransfer(prev => prev ? { ...prev, done: true } : null)
          rxBufRef.current = []
          rxMetaRef.current = null
          rxSizeRef.current = 0
        }
      }
    })
  }, [])

  /** Connect to the signaling server with the given session UUID. */
  const connect = useCallback(() => {
    // Nullify the ref before closing so the close handler on the old WS
    // can detect it has been superseded and skip phase updates.
    const old = wsRef.current
    wsRef.current = null
    old?.close()
    updatePhase('connecting')

    const ws = new WebSocket(`${SIGNALING_URL}?session=${sessionId}`)
    wsRef.current = ws

    ws.addEventListener('message', (ev: MessageEvent) => {
      void (async () => {
        try {
          const msg = JSON.parse(ev.data as string) as SignalingMsg

          if (msg.type === 'waiting') {
            updatePhase('waiting')

          } else if (msg.type === 'ready') {
            updatePhase('handshaking')

            if (msg.role === 'initiator') {
              const pc = newPC()
              attachChannel(pc.createDataChannel('files'))
              await pc.setLocalDescription(await pc.createOffer())
              await awaitIceGathering(pc)
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'sdp', payload: pc.localDescription }))
              }
            }
            // responder waits for the 'sdp' message with the offer

          } else if (msg.type === 'sdp') {
            const desc = msg.payload

            if (desc.type === 'offer') {
              const pc = newPC()
              pc.addEventListener('datachannel', e => attachChannel(e.channel))
              await pc.setRemoteDescription(desc)
              await pc.setLocalDescription(await pc.createAnswer())
              await awaitIceGathering(pc)
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'sdp', payload: pc.localDescription }))
              }
            } else if (desc.type === 'answer') {
              await pcRef.current?.setRemoteDescription(desc)
            }

          } else if (msg.type === 'peer_left') {
            updatePhase('peer_left')

          } else if (msg.type === 'error') {
            setError(msg.message)
            updatePhase('failed')
          }
        } catch (e) {
          setError(String(e))
          updatePhase('failed')
        }
      })()
    })

    ws.addEventListener('close', () => {
      if (wsRef.current !== ws) return  // superseded by a newer connection
      const p = phaseRef.current
      if (p !== 'connected' && p !== 'peer_left' && p !== 'failed' && p !== 'idle') {
        setError('Lost connection to signaling server.')
        updatePhase('failed')
      }
    })

    ws.addEventListener('error', () => {
      setError(`Could not connect to signaling server (${SIGNALING_URL}).`)
      updatePhase('failed')
    })
  }, [updatePhase, newPC, attachChannel])

  /** Send a file over the open data channel, respecting back-pressure. */
  const sendFile = useCallback(async (file: File) => {
    const ch = channelRef.current
    if (!ch || ch.readyState !== 'open') return

    setTransfer({ name: file.name, size: file.size, transferred: 0, direction: 'sending', done: false })
    ch.send(JSON.stringify({ name: file.name, size: file.size }))

    const buf = await file.arrayBuffer()
    let offset = 0
    while (offset < buf.byteLength) {
      if (ch.bufferedAmount > 1_048_576) {
        await new Promise<void>(resolve => {
          ch.bufferedAmountLowThreshold = 524_288
          ch.onbufferedamountlow = () => resolve()
        })
      }
      ch.send(buf.slice(offset, offset + CHUNK_SIZE))
      offset = Math.min(offset + CHUNK_SIZE, buf.byteLength)
      setTransfer(prev => prev ? { ...prev, transferred: offset } : null)
    }
    setTransfer(prev => prev ? { ...prev, done: true } : null)
  }, [])

  const reset = useCallback(() => {
    const ws = wsRef.current
    wsRef.current = null
    ws?.close()
    pcRef.current?.close()
    pcRef.current = null
    channelRef.current = null
    rxBufRef.current = []
    rxMetaRef.current = null
    rxSizeRef.current = 0
    updatePhase('idle')
    setTransfer(null)
    setError(null)
  }, [updatePhase])

  return { phase, transfer, receivedFiles, error, connect, sendFile, reset }
}
