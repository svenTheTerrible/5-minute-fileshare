// idle        – no session yet
// connecting  – WebSocket connecting to signaling server
// waiting     – connected, waiting for the other peer to join
// handshaking – both peers present, exchanging SDP + ICE
// connected   – WebRTC data channel open, ready to transfer
// peer_left   – other peer disconnected
// failed      – unrecoverable error
export type Phase =
  | 'idle'
  | 'connecting'
  | 'waiting'
  | 'handshaking'
  | 'connected'
  | 'peer_left'
  | 'failed'

export interface FileTransfer {
  name: string
  size: number
  transferred: number
  direction: 'sending' | 'receiving'
  done: boolean
}

export interface ReceivedFile {
  id: string
  name: string
  url: string
  size: number
}
