import { useState, useRef, type FC, type ChangeEvent } from 'react'
import {
  Alert, Box, Button, CircularProgress, Divider,
  LinearProgress, List, ListItem, ListItemText,
  Paper, TextField, Typography,
} from '@mui/material'
import type { Peer } from '../types'
import { useWebRTCFileShare } from '../hooks/useWebRTCFileShare'

function fmt(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1_048_576) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1_048_576).toFixed(1)} MB`
}

interface Props {
  peer: Peer
}

export const FileShareSession: FC<Props> = ({ peer }) => {
  const {
    phase, localSDP, transfer, receivedFiles, error,
    createOffer, receiveOffer, receiveAnswer, sendFile, reset,
  } = useWebRTCFileShare()

  // Idle-phase UI state
  const [responding, setResponding] = useState(false)
  const [offerInput, setOfferInput] = useState('')
  // offer_ready-phase UI state
  const [answerInput, setAnswerInput] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const copy = (text: string) => { void navigator.clipboard.writeText(text) }

  // ── Failed ──────────────────────────────────────────────────────────────────
  if (phase === 'failed') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Alert severity="error">{error ?? 'Connection failed.'}</Alert>
        <Button variant="contained" onClick={reset} sx={{ alignSelf: 'flex-start' }}>
          Try Again
        </Button>
      </Box>
    )
  }

  // ── ICE gathering ───────────────────────────────────────────────────────────
  if (phase === 'gathering') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={22} />
        <Typography>Gathering ICE candidates…</Typography>
      </Box>
    )
  }

  // ── Initiator: offer ready, waiting for answer ───────────────────────────────
  if (phase === 'offer_ready') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Step 1 — Share this offer with {peer.name}</Typography>
        <TextField
          multiline rows={5} value={localSDP} size="small" fullWidth
          slotProps={{ input: { readOnly: true } }}
        />
        <Button variant="outlined" onClick={() => copy(localSDP)} sx={{ alignSelf: 'flex-start' }}>
          Copy Offer
        </Button>

        <Divider />

        <Typography variant="h6">Step 2 — Paste their answer</Typography>
        <TextField
          multiline rows={5} size="small" fullWidth
          placeholder="Paste answer SDP here…"
          value={answerInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setAnswerInput(e.target.value)}
        />
        <Button
          variant="contained"
          disabled={!answerInput.trim()}
          onClick={() => { void receiveAnswer(answerInput.trim()) }}
          sx={{ alignSelf: 'flex-start' }}
        >
          Connect
        </Button>
      </Box>
    )
  }

  // ── Responder: answer ready, waiting for ICE ─────────────────────────────────
  if (phase === 'answer_ready') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Share this answer with {peer.name}</Typography>
        <TextField
          multiline rows={5} value={localSDP} size="small" fullWidth
          slotProps={{ input: { readOnly: true } }}
        />
        <Button variant="outlined" onClick={() => copy(localSDP)} sx={{ alignSelf: 'flex-start' }}>
          Copy Answer
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
          <CircularProgress size={18} />
          <Typography variant="body2" color="text.secondary">Waiting for connection…</Typography>
        </Box>
      </Box>
    )
  }

  // ── Connected ────────────────────────────────────────────────────────────────
  if (phase === 'connected') {
    const busy = transfer !== null && !transfer.done
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Alert severity="success">Connected to {peer.name} ({peer.ip})</Alert>

        <Box>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0]
              if (file) void sendFile(file)
              e.target.value = ''
            }}
          />
          <Button
            variant="contained"
            disabled={busy}
            onClick={() => fileInputRef.current?.click()}
          >
            Send File
          </Button>
        </Box>

        {transfer && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body2" gutterBottom>
              {transfer.direction === 'sending' ? 'Sending' : 'Receiving'}: {transfer.name} ({fmt(transfer.size)})
              {transfer.done && ' — Done'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.round((transfer.transferred / transfer.size) * 100))}
              sx={{ mb: 0.5 }}
            />
            <Typography variant="caption" color="text.secondary">
              {fmt(transfer.transferred)} / {fmt(transfer.size)}
            </Typography>
          </Paper>
        )}

        {receivedFiles.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>Received Files</Typography>
            <List dense disablePadding>
              {receivedFiles.map(f => (
                <ListItem key={f.id} disableGutters>
                  <ListItemText primary={f.name} secondary={fmt(f.size)} />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = f.url
                      a.download = f.name
                      a.click()
                    }}
                  >
                    Download
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Box>
          <Button color="error" onClick={reset}>Disconnect</Button>
        </Box>
      </Box>
    )
  }

  // ── Idle ─────────────────────────────────────────────────────────────────────
  if (responding) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Paste the offer from {peer.name}</Typography>
        <TextField
          multiline rows={5} size="small" fullWidth
          placeholder="Paste offer SDP here…"
          value={offerInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setOfferInput(e.target.value)}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            disabled={!offerInput.trim()}
            onClick={() => { void receiveOffer(offerInput.trim()) }}
          >
            Generate Answer
          </Button>
          <Button onClick={() => { setResponding(false); setOfferInput('') }}>
            Cancel
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body1">
        Connect to <strong>{peer.name}</strong> ({peer.ip})
      </Typography>
      <Typography variant="body2" color="text.secondary">
        No signaling server is available yet, so SDP must be exchanged manually.
        One peer creates an offer, the other pastes it to generate an answer, then the first peer pastes that answer to complete the handshake.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <Button variant="contained" onClick={() => { void createOffer() }}>
          Initiate (Create Offer)
        </Button>
        <Button variant="outlined" onClick={() => setResponding(true)}>
          Respond (Paste Offer)
        </Button>
      </Box>
    </Box>
  )
}
