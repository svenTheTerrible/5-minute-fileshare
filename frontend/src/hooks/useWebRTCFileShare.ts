import { useState, useRef, useCallback } from "react";
import type { Phase } from "../types";
import { useStateAndRef } from "./useStateAndRef";
import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = 16_384;
const BUFFER_HIGH_WATERMARK = 1_048_576; // 1 MB — pause sending above this
const BUFFER_LOW_WATERMARK = 262_144; // 256 KB — resume sending once drained here

// Vite proxies /ws → http://localhost:8080/ws (including WebSocket upgrades).
// Override with VITE_SIGNALING_URL in .env.local for production or non-proxied setups.
const SIGNALING_URL =
  (import.meta.env.VITE_SIGNALING_URL as string | undefined) ??
  `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`;

type SignalingMsg =
  | { type: "waiting" }
  | { type: "ready"; role: "initiator" | "responder" }
  | { type: "sdp"; payload: RTCSessionDescriptionInit }
  | { type: "peer_left" }
  | { type: "error"; message: string };

function awaitIceGathering(pc: RTCPeerConnection): Promise<void> {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === "complete") {
      resolve();
      return;
    }
    const onchange = () => {
      if (pc.iceGatheringState === "complete") {
        pc.removeEventListener("icegatheringstatechange", onchange);
        resolve();
      }
    };
    pc.addEventListener("icegatheringstatechange", onchange);
  });
}

type TransferDirection = "send" | "receive";

export interface TransferFile {
  id: string;
  name: string;
  size: number;
  data?: File | Blob;
  completion: number;
  transferDirection: TransferDirection;
}

export interface UseWebRTCFileShare {
  phase: Phase;
  files: TransferFile[];
  error: string | null;
  connect: () => void;
  sendFiles: (files: File[]) => void;
  reset: () => void;
}

export const useWebRTCFileShare = (sessionId: string): UseWebRTCFileShare => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [files, setFiles, filesRef] = useStateAndRef<TransferFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  // phaseRef mirrors phase so WS callbacks don't capture a stale closure value.
  const phaseRef = useRef<Phase>("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const uploadQueueRunning = useRef<boolean>(false);

  // Receive-side accumulation buffers
  const rxBufRef = useRef<ArrayBuffer[]>([]);
  const rxMetaRef = useRef<{ name: string; size: number } | null>(null);
  const rxSizeRef = useRef(0);

  const updatePhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const newPC = useCallback(() => {
    const pc = new RTCPeerConnection();
    pcRef.current = pc;
    pc.addEventListener("connectionstatechange", () => {
      if (pc.connectionState === "connected") updatePhase("connected");
      if (pc.connectionState === "failed") {
        setError("WebRTC connection failed.");
        updatePhase("failed");
      }
    });
    return pc;
  }, [updatePhase]);

  const attachChannel = useCallback((ch: RTCDataChannel) => {
    channelRef.current = ch;
    ch.binaryType = "arraybuffer";
    ch.bufferedAmountLowThreshold = BUFFER_LOW_WATERMARK;
    ch.addEventListener("message", (ev: MessageEvent) => {
      console.log("some message received");
      if (typeof ev.data === "string") {
        const meta = JSON.parse(ev.data as string) as {
          name: string;
          size: number;
        };
        console.log("file header received", meta);
        rxMetaRef.current = meta;
        rxBufRef.current = [];
        rxSizeRef.current = 0;
        setFiles((current) => [
          ...current,
          {
            id: uuidv4(),
            name: meta.name,
            size: meta.size,
            completion: 0,
            transferDirection: "receive",
          },
        ]);
      } else {
        const chunk = ev.data as ArrayBuffer;
        rxBufRef.current.push(chunk);
        rxSizeRef.current += chunk.byteLength;
        //todo bug, needs last receiving element in list, not last element
        setFiles((current) =>
          current.map((file, index) =>
            current.length - 1 === index
              ? { ...file, completion: (rxSizeRef.current * 100) / file.size }
              : file,
          ),
        );
        const meta = rxMetaRef.current;
        if (meta && rxSizeRef.current >= meta.size) {
          setFiles((current) =>
            current.map((file, index) =>
              current.length - 1 === index
                ? { ...file, completion: 100, data: new Blob(rxBufRef.current) }
                : file,
            ),
          );
          rxBufRef.current = [];
          rxMetaRef.current = null;
          rxSizeRef.current = 0;
        }
      }
    });
  }, []);

  /** Connect to the signaling server with the given session UUID. */
  const connect = useCallback(() => {
    // Nullify the ref before closing so the close handler on the old WS
    // can detect it has been superseded and skip phase updates.
    const old = wsRef.current;
    wsRef.current = null;
    old?.close();
    updatePhase("connecting");

    const ws = new WebSocket(`${SIGNALING_URL}?session=${sessionId}`);
    wsRef.current = ws;

    ws.addEventListener("message", (ev: MessageEvent) => {
      void (async () => {
        try {
          const msg = JSON.parse(ev.data as string) as SignalingMsg;
          if (msg.type === "waiting") {
            updatePhase("waiting");
          } else if (msg.type === "ready") {
            updatePhase("handshaking");

            if (msg.role === "initiator") {
              const pc = newPC();
              attachChannel(pc.createDataChannel("files"));
              await pc.setLocalDescription(await pc.createOffer());
              await awaitIceGathering(pc);
              if (ws.readyState === WebSocket.OPEN) {
                console.log("before sending sdp");
                ws.send(
                  JSON.stringify({ type: "sdp", payload: pc.localDescription }),
                );
                console.log("after sending sdp");
              }
            }
            // responder waits for the 'sdp' message with the offer
          } else if (msg.type === "sdp") {
            const desc = msg.payload;

            if (desc.type === "offer") {
              const pc = newPC();
              pc.addEventListener("datachannel", (e) =>
                attachChannel(e.channel),
              );
              await pc.setRemoteDescription(desc);
              await pc.setLocalDescription(await pc.createAnswer());
              await awaitIceGathering(pc);
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(
                  JSON.stringify({ type: "sdp", payload: pc.localDescription }),
                );
              }
            } else if (desc.type === "answer") {
              await pcRef.current?.setRemoteDescription(desc);
            }
          } else if (msg.type === "peer_left") {
            updatePhase("peer_left");
          } else if (msg.type === "error") {
            setError(msg.message);
            updatePhase("failed");
          }
        } catch (e) {
          console.error(String(e));
          updatePhase("failed");
        }
      })();
    });

    ws.addEventListener("close", () => {
      if (wsRef.current !== ws) return; // superseded by a newer connection
      const p = phaseRef.current;
      if (
        p !== "connected" &&
        p !== "peer_left" &&
        p !== "failed" &&
        p !== "idle"
      ) {
        setError("Lost connection to signaling server.");
        updatePhase("failed");
      }
    });

    ws.addEventListener("error", () => {
      setError(`Could not connect to signaling server (${SIGNALING_URL}).`);
      updatePhase("failed");
    });
  }, [updatePhase, newPC, attachChannel]);

  // Send a file over the open data channel, respecting back-pressure.
  const sendFile = async (transferFile: TransferFile) => {
    const file: File | undefined =
      transferFile.transferDirection === "send"
        ? (transferFile.data as File)
        : undefined;

    console.log("Attempting to send file:", file?.name);
    if (!file) return;

    const ch = channelRef.current;
    if (!ch || ch.readyState !== "open") {
      console.error(
        "Cannot send files: RTCDataChannel is not open or connected.",
      );
      return;
    }

    try {
      // 1. Send metadata header first
      ch.send(JSON.stringify({ name: file.name, size: file.size }));
      console.log("Sent file header successfully");

      const buf = await file.arrayBuffer();
      let offset = 0;
      while (offset < buf.byteLength) {
        if (ch.bufferedAmount >= BUFFER_HIGH_WATERMARK) {
          await new Promise<void>((resolve) => {
            const onLow = () => {
              ch.removeEventListener("bufferedamountlow", onLow);
              resolve();
            };
            ch.addEventListener("bufferedamountlow", onLow);
          });
        }

        const chunk = buf.slice(offset, offset + CHUNK_SIZE);
        ch.send(chunk);
        offset += chunk.byteLength;

        const percentage = (offset * 100) / file.size;
        setFiles((current) =>
          current.map((f) =>
            f.id === transferFile.id
              ? { ...f, completion: Math.min(100, percentage) }
              : f,
          ),
        );
      }

      // 2. Mark file as completed
      setFiles((current) =>
        current.map((f) =>
          f.id === transferFile.id ? { ...f, completion: 100 } : f,
        ),
      );
    } catch (e) {
      console.error("Error sending file over WebRTC DataChannel: " + String(e));
    }
  };

  const sendIncompleteFiles = async () => {
    uploadQueueRunning.current = true;
    const firstNotSentFile = filesRef.current.find(
      (file) => file.transferDirection === "send" && file.completion === 0,
    );

    if (firstNotSentFile) {
      await sendFile(firstNotSentFile);
      setTimeout(() => sendIncompleteFiles(), 1000);
    }
    uploadQueueRunning.current = false;
  };

  const sendFiles = useCallback(
    (newFiles: File[]) => {
      setFiles((current) => [
        ...current,
        ...newFiles.map(
          (singleNewFile): TransferFile => ({
            id: uuidv4(),
            completion: 0,
            name: singleNewFile.name,
            size: singleNewFile.size,
            transferDirection: "send",
            data: singleNewFile,
          }),
        ),
      ]);

      if (uploadQueueRunning.current === false) {
        uploadQueueRunning.current = true;
        sendIncompleteFiles();
      }
    },
    [setFiles],
  );

  const reset = useCallback(() => {
    const ws = wsRef.current;
    wsRef.current = null;
    ws?.close();
    pcRef.current?.close();
    pcRef.current = null;
    channelRef.current = null;
    rxBufRef.current = [];
    rxMetaRef.current = null;
    rxSizeRef.current = 0;
    updatePhase("idle");
    setFiles([]);
    setError(null);
  }, [updatePhase]);

  return { phase, files, error, connect, sendFiles, reset };
};
