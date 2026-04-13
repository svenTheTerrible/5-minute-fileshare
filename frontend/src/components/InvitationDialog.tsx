import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Tooltip,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import type { FC } from "react";
import { useState } from "react";

interface InvitationDialogProps {
  sessionId: string;
  open: boolean;
  closeDialog: () => void;
}

export const InvitationDialog: FC<InvitationDialogProps> = ({
  sessionId,
  closeDialog,
  open,
}) => {
  const [showCopied, setShowCopied] = useState<boolean>(false);
  const joinUrl = `${location.origin}/?session=${sessionId}`;

  const copyJoinUrl = () => {
    setShowCopied(true);
    navigator.clipboard.writeText(joinUrl);
    window.setTimeout(() => setShowCopied(false), 1000);
  };

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle sx={{ textAlign: "center" }}>Direkt verbinden</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        <QRCodeSVG value={joinUrl} size={220} />
        <Tooltip title={showCopied ? "Kopiert!" : undefined}>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button fullWidth variant="contained" onClick={copyJoinUrl}>
              URL kopieren
            </Button>
          </Box>
        </Tooltip>
      </DialogContent>
    </Dialog>
  );
};
