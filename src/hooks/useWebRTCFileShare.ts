import { useState, useRef, useCallback } from 'react'
import type { Phase, FileTransfer, ReceivedFile } from '../types'

const CHUNK_SIZE = 16_384 // 16 KB — safe for all browsers

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

export function useWebRTCFileShare() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [localSDP, setLocalSDP] = useState('')
  const [transfer, setTransfer] = useState<FileTransfer | null>(null)
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([])
  const [error, setError] = useState<string | null>(null)

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const channelRef = useRef<RTCDataChannel | null>(null)

  // Receive-side state
  const rxBufRef = useRef<ArrayBuffer[]>([])
  const rxMetaRef = useRef<{ name: string; size: number } | null>(null)
  const rxSizeRef = useRef(0)

  const newPC = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })
    pcRef.current = pc
    pc.addEventListener('connectionstatechange', () => {
      if (pc.connectionState === 'connected') setPhase('connected')
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        setPhase('failed')
        setError('Connection lost.')
      }
    })
    return pc
  }, [])

  const attachChannel = useCallback((ch: RTCDataChannel) => {
    channelRef.current = ch
    ch.binaryType = 'arraybuffer'

    ch.addEventListener('message', (ev: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
          const blob = new Blob(rxBufRef.current)
          const url = URL.createObjectURL(blob)
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

  /** Initiator: create an offer. Show localSDP → wait for answer paste. */
  const createOffer = useCallback(async () => {
    try {
      const pc = newPC()
      attachChannel(pc.createDataChannel('files'))
      setPhase('gathering')
      await pc.setLocalDescription(await pc.createOffer())
      await awaitIceGathering(pc)
      setLocalSDP(JSON.stringify(pc.localDescription))
      setPhase('offer_ready')
    } catch (e) {
      setError(String(e))
      setPhase('failed')
    }
  }, [newPC, attachChannel])

  /** Responder: receive an offer, produce an answer. Show localSDP → wait for ICE. */
  const receiveOffer = useCallback(async (offerJSON: string) => {
    try {
      const pc = newPC()
      pc.addEventListener('datachannel', ev => attachChannel(ev.channel))
      setPhase('gathering')
      await pc.setRemoteDescription(JSON.parse(offerJSON) as RTCSessionDescriptionInit)
      await pc.setLocalDescription(await pc.createAnswer())
      await awaitIceGathering(pc)
      setLocalSDP(JSON.stringify(pc.localDescription))
      setPhase('answer_ready')
    } catch (e) {
      setError(String(e))
      setPhase('failed')
    }
  }, [newPC, attachChannel])

  /** Initiator: complete handshake by setting the responder's answer. */
  const receiveAnswer = useCallback(async (answerJSON: string) => {
    try {
      await pcRef.current?.setRemoteDescription(JSON.parse(answerJSON) as RTCSessionDescriptionInit)
    } catch (e) {
      setError(String(e))
      setPhase('failed')
    }
  }, [])

  /** Send a file over the open data channel, respecting back-pressure. */
  const sendFile = useCallback(async (file: File) => {
    const ch = channelRef.current
    if (!ch || ch.readyState !== 'open') return

    setTransfer({ name: file.name, size: file.size, transferred: 0, direction: 'sending', done: false })
    ch.send(JSON.stringify({ name: file.name, size: file.size }))

    const buf = await file.arrayBuffer()
    let offset = 0
    while (offset < buf.byteLength) {
      // Throttle when the send buffer is too full (> 1 MB queued)
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
    pcRef.current?.close()
    pcRef.current = null
    channelRef.current = null
    rxBufRef.current = []
    rxMetaRef.current = null
    rxSizeRef.current = 0
    setPhase('idle')
    setLocalSDP('')
    setTransfer(null)
    setError(null)
  }, [])

  return { phase, localSDP, transfer, receivedFiles, error, createOffer, receiveOffer, receiveAnswer, sendFile, reset }
}
