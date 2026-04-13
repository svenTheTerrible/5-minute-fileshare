import type { FC } from "react";
import { ConnectButton } from "./ConnectButton";
import { FileShareSession } from "./FileShareSession";
import { AppBar, Box, Paper, Toolbar, Typography } from "@mui/material";
import { useWebRTCFileShare } from "../hooks/useWebRTCFileShare";

interface SessionBodyProps {
  sessionId: string;
  onNewSession: () => void;
}

export const SessionBody: FC<SessionBodyProps> = ({
  onNewSession,
  sessionId,
}) => {
  const fileshare = useWebRTCFileShare(sessionId);

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar variant="dense" sx={{ display: "flex", py: 2 }}>
          <Typography variant="h6">5-Minute File Share</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <ConnectButton
            fileshare={fileshare}
            sessionId={sessionId}
            onNewSession={onNewSession}
          />
        </Toolbar>
      </AppBar>
      <FileShareSession fileshare={fileshare} />
    </>
  );
};
