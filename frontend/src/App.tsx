import { useState, useCallback, type FC } from 'react'
import { AppBar, Box, Paper, Toolbar, Typography } from '@mui/material'
import { FileShareSession } from './components/FileShareSession'
import { ConnectButton } from './components/ConnectButton'
import { SessionBody } from './components/SessionBody'

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
      <SessionBody key={sessionId} sessionId={sessionId} onNewSession={newSession}/>
    </Box>
  )
}
