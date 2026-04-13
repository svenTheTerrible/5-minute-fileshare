import type { FC } from "react";
import { Body } from "./FileShareSession";
import { Box } from "@mui/material";
import { useWebRTCFileShare } from "../hooks/useWebRTCFileShare";
import { HeaderBar } from "./headerBar/HeaderBar";

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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <HeaderBar
        fileshare={fileshare}
        onNewSession={onNewSession}
        sessionId={sessionId}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Body fileshare={fileshare} />
      </Box>
    </Box>
  );
};
