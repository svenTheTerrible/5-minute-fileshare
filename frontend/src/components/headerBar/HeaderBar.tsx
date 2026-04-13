import type { FC } from "react";
import { ConnectButton } from "../ConnectButton";
import { Logo } from "../Logo";
import { Box } from "@mui/material";
import type { UseWebRTCFileShare } from "../../hooks/useWebRTCFileShare";
import { GlasBackground } from "./GlasBackground";

interface HeaderBarProps {
  fileshare: UseWebRTCFileShare;
  sessionId: string;
  onNewSession: () => void;
}

export const HeaderBar: FC<HeaderBarProps> = ({
  fileshare,
  sessionId,
  onNewSession,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          p: 3,
          mt: 4,
          position: "relative",
        }}
      >
        <GlasBackground />
        <Logo />
        <ConnectButton
          fileshare={fileshare}
          sessionId={sessionId}
          onNewSession={onNewSession}
        />
      </Box>
    </Box>
  );
};
