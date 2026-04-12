import { useState, type FC } from 'react'
import {
  AppBar, Box, Divider, List, ListItemButton, ListItemText,
  Paper, Toolbar, Typography,
} from '@mui/material'
import type { Peer } from './types'
import { FileShareSession } from './components/FileShareSession'

// Known peers on the local network.
// When a signaling server is available, replace this static list with
// a live roster fetched from the server and wire automatic SDP exchange.
const PEERS: Peer[] = [
  { id: '1', name: 'relaxo', ip: '192.168.178.92' },
  { id: '2', name: 'handy', ip: '192.168.178.81' },
  { id: '3', name: 'tablet', ip: '192.168.178.84' }
]

export const App: FC = () => {
  const [selected, setSelected] = useState<Peer | null>(null)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar variant="dense">
          <Typography variant="h6">5-Minute File Share</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Peer list sidebar */}
        <Paper
          square elevation={2}
          sx={{ width: 220, display: 'flex', flexDirection: 'column', borderRadius: 0 }}
        >
          <Typography
            variant="overline"
            sx={{ px: 2, py: 1.5, lineHeight: 1, color: 'text.secondary', display: 'block' }}
          >
            Peers
          </Typography>
          <Divider />
          <List disablePadding sx={{ flex: 1, overflow: 'auto' }}>
            {PEERS.map(peer => (
              <ListItemButton
                key={peer.id}
                selected={selected?.id === peer.id}
                onClick={() => setSelected(peer)}
              >
                <ListItemText
                  primary={peer.name}
                  secondary={peer.ip}
                  slotProps={{ primary: { variant: 'body2' }, secondary: { variant: 'caption' } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* Main content */}
        <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>
          {selected ? (
            // key resets the session component (and hook state) when switching peers
            <FileShareSession key={selected.id} peer={selected} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography color="text.secondary">Select a peer to start sharing files</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
