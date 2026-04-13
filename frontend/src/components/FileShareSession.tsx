import { useEffect, useRef, type FC, type ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import type { UseWebRTCFileShare } from "../hooks/useWebRTCFileShare";

function toHumanReadableFileSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1_048_576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1_048_576).toFixed(1)} MB`;
}

interface Props {
  fileshare: UseWebRTCFileShare;
}

export const FileShareSession: FC<Props> = ({ fileshare }) => {
  const { phase, receivedFiles, transfer, sendFile, reset, connect, error } =
    fileshare;

  return <>body</>;
};
