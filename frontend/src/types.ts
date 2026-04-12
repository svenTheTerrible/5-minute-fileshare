export interface Peer {
  id: string
  name: string
  ip: string
}

// idle       – no connection attempt yet
// gathering  – creating offer or answer, waiting for ICE candidates
// offer_ready  – initiator: offer is ready to share, waiting to receive answer
// answer_ready – responder: answer is ready to share, waiting for ICE to connect
// connected  – data channel is open
// failed     – connection failed or disconnected
export type Phase =
  | 'idle'
  | 'gathering'
  | 'offer_ready'
  | 'answer_ready'
  | 'connected'
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
