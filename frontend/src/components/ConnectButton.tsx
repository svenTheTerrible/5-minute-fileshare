import type { FC } from "react";
import { useState } from "react";
import type { UseWebRTCFileShare } from "../hooks/useWebRTCFileShare";
import { Box, Button, CircularProgress } from "@mui/material";
import { InvitationDialog } from "./InvitationDialog";
import "./ConnectButton.css";
import { useEffectOnce } from "../hooks/useEffectOnce";

interface ConnectButtonProps {
  fileshare: UseWebRTCFileShare;
  sessionId: string;
  onNewSession: () => void;
}

export const ConnectButton: FC<ConnectButtonProps> = ({
  fileshare,
  sessionId,
  onNewSession,
}) => {
  const { connect, phase } = fileshare;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffectOnce(() => {
    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /*
  const startNewSession = () => {
    reset();
    onNewSession();
  };
  */

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const renderButtonContent = () => {
    switch (phase) {
      case "connected":
        return (
          <>
            <Box className="connect-button-green-pulse" />{" "}
            <Box sx={{ ml: 1 }}>connected</Box>
          </>
        );
      case "handshaking":
      case "connecting":
        return <CircularProgress size={24} />;
      case "waiting":
      case "peer_left":
      case "failed":
      case "idle":
        return "connect";
    }
  };

  return (
    <>
      <InvitationDialog
        sessionId={sessionId}
        open={dialogOpen}
        closeDialog={closeDialog}
      />
      <Button
        variant="outlined"
        sx={{
          backgroundColor: "transparent",
          minHeight: 37,
          transition: "0.2s",
          ml: 2,
          border: "2px solid white",
          color: "white",
          borderRadius: 16,
        }}
        onClick={openDialog}
      >
        {renderButtonContent()}
      </Button>
    </>
  );
};
