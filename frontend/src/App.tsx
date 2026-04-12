import { useState, useCallback, type FC } from 'react'
import { AppBar, Box, Paper, Toolbar, Typography } from '@mui/material'
import { FileShareSession } from './components/FileShareSession'

function initSession(): string {
  const fromUrl = new URLSearchParams(location.search).get('session')
  if (fromUrl) return fromUrl
  const id = crypto.randomUUID()
  history.replaceState(null, '', `?session=${id}`)
  return id
}

export const App: FC = () => {
  const [sessionId, setSessionId] = useState(initSession)

  const newSession = useCallback(() => {
    const id = crypto.randomUUID()
    history.replaceState(null, '', `?session=${id}`)
    setSessionId(id)
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar variant="dense">
          <Typography variant="h6">5-Minute File Share</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
          {/* key ensures the component (and hook) fully resets when the session changes */}
          <FileShareSession key={sessionId} sessionId={sessionId} onNewSession={newSession} />
        </Paper>
      </Box>
    </Box>
  )
}
