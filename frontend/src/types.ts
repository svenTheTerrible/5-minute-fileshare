// idle        – no session yet
// connecting  – WebSocket connecting to signaling server
// waiting     – connected, waiting for the other peer to join
// handshaking – both peers present, exchanging SDP + ICE
// connected   – WebRTC data channel open, ready to transfer
// peer_left   – other peer disconnected
// failed      – unrecoverable error
export type Phase =
  | "idle"
  | "connecting"
  | "waiting"
  | "handshaking"
  | "connected"
  | "peer_left"
  | "failed";
