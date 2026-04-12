import { useEffect, useRef, type FC, type ChangeEvent } from 'react'
import {
  Alert, Box, Button, CircularProgress,
  LinearProgress, List, ListItem, ListItemText,
  Paper, Typography,
} from '@mui/material'
import { QRCodeSVG } from 'qrcode.react'
import { useWebRTCFileShare } from '../hooks/useWebRTCFileShare'

function toHumanReadableFileSize(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1_048_576) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1_048_576).toFixed(1)} MB`
}

interface Props {
  sessionId: string
  onNewSession: () => void
}

export const FileShareSession: FC<Props> = ({ sessionId, onNewSession }) => {
  const { phase, transfer, receivedFiles, error, connect, sendFile, reset } = useWebRTCFileShare()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-connect once on mount. sessionId is stable for the lifetime of this
  // component instance (App uses key={sessionId} to remount on change).
  useEffect(() => {
    connect(sessionId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startNewSession = () => {
    reset()
    onNewSession()
  }

  // The URL encoded in the QR code — scanning it opens the app and auto-joins.
  const joinUrl = `${location.origin}/?session=${sessionId}`

  // ── Failed ───────────────────────────────────────────────────────────────────
  if (phase === 'failed') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Alert severity="error">{error ?? 'Connection failed.'}</Alert>
        <Button variant="contained" onClick={startNewSession} sx={{ alignSelf: 'flex-start' }}>
          New Session
        </Button>
      </Box>
    )
  }

  // ── Peer left ────────────────────────────────────────────────────────────────
  if (phase === 'peer_left') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Alert severity="warning">The other device disconnected.</Alert>
        <Button variant="contained" onClick={startNewSession} sx={{ alignSelf: 'flex-start' }}>
          New Session
        </Button>
      </Box>
    )
  }

  // ── Connecting ───────────────────────────────────────────────────────────────
  if (phase === 'connecting') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={22} />
        <Typography>Connecting…</Typography>
      </Box>
    )
  }

  // ── Waiting — show QR code so the other device can scan and join ─────────────
  if (phase === 'waiting') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <Typography variant="h6">Scan to join from another device</Typography>
        <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, display: 'inline-block' }}>
          <QRCodeSVG value={joinUrl} size={220} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all', textAlign: 'center' }}>
          {joinUrl}
        </Typography>
        <Button variant="outlined" size="small" onClick={() => { void navigator.clipboard.writeText(joinUrl) }}>
          Copy Link
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">Waiting for other device…</Typography>
        </Box>
      </Box>
    )
  }

  // ── Handshaking ──────────────────────────────────────────────────────────────
  if (phase === 'handshaking') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={22} />
        <Typography>Setting up connection…</Typography>
      </Box>
    )
  }

  // ── Connected ────────────────────────────────────────────────────────────────
  if (phase === 'connected') {
    const busy = transfer !== null && !transfer.done
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Alert severity="success">Connected</Alert>

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
              {transfer.direction === 'sending' ? 'Sending' : 'Receiving'}: {transfer.name} ({toHumanReadableFileSize(transfer.size)})
              {transfer.done && ' — Done'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.round((transfer.transferred / transfer.size) * 100))}
              sx={{ mb: 0.5 }}
            />
            <Typography variant="caption" color="text.secondary">
              {toHumanReadableFileSize(transfer.transferred)} / {toHumanReadableFileSize(transfer.size)}
            </Typography>
          </Paper>
        )}

        {receivedFiles.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>Received Files</Typography>
            <List dense disablePadding>
              {receivedFiles.map(f => (
                <ListItem key={f.id} disableGutters>
                  <ListItemText primary={f.name} secondary={toHumanReadableFileSize(f.size)} />
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
          <Button color="error" onClick={startNewSession}>End Session</Button>
        </Box>
      </Box>
    )
  }

  return null
}
