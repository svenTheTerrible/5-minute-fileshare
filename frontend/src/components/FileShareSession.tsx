import { useCallback, useMemo, useState, type FC } from "react";
import { Box, Grid } from "@mui/material";
import type { UseWebRTCFileShare } from "../hooks/useWebRTCFileShare";
import { useDropzone } from "react-dropzone";
import { FileTile } from "./filetile/FileTile";
import { theme } from "../stories/theme";
import { PixelButton } from "../stories/PixelButton";

interface Props {
  fileshare: UseWebRTCFileShare;
}

type FileFilter = "all" | "received" | "sent";

export const Body: FC<Props> = ({ fileshare }) => {
  const [filter, setFilter] = useState<FileFilter>("all");
  const { files, sendFiles } = fileshare;

  const filteredFiles = useMemo(() => {
    return files.filter(
      (file) =>
        filter === "all" ||
        (filter === "sent" && file.transferDirection === "send") ||
        (filter === "received" && file.transferDirection === "receive"),
    );
  }, [filter, files]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    sendFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Box
          {...getRootProps()}
          sx={{ border: `2px dashed ${theme.lineStrong}`, mt: 3, mx: 3, p: 3 }}
        >
          <input {...getInputProps()} />
          <Box sx={{ textAlign: "center" }}>
            <img src="/pixel-arrow-down.svg" />
          </Box>
          <p style={{ textAlign: "center", color: theme.text }}>
            DROP FILES TO SEND
          </p>
          <p style={{ textAlign: "center", color: theme.textMuted }}>
            OR CLICK TO BROWSE - NOTHING IS UPLOADED TO A SERVER
          </p>
        </Box>
      </Grid>

      <Grid size={12} sx={{ px: 3 }}>
        <PixelButton
          variant={filter === "all" ? "outline" : "secondary"}
          size="sm"
          style={{ marginRight: 8 }}
          onClick={() => setFilter("all")}
        >
          ALL
        </PixelButton>
        <PixelButton
          variant={filter === "sent" ? "outline" : "secondary"}
          size="sm"
          style={{ marginRight: 8 }}
          onClick={() => setFilter("sent")}
        >
          SENT
        </PixelButton>
        <PixelButton
          variant={filter === "received" ? "outline" : "secondary"}
          size="sm"
          onClick={() => setFilter("received")}
        >
          RECEIVED
        </PixelButton>
      </Grid>
      {filteredFiles.length === 0 ? (
        <Grid size={12}>
          <Box sx={{ textAlign: "center", color: theme.text }}>NO FILES</Box>
        </Grid>
      ) : null}
      <Grid container size={12} spacing={3} sx={{ px: 3, pb: 3 }}>
        {filteredFiles.map((file) => (
          <FileTile key={file.id} file={file} />
        ))}
      </Grid>
    </Grid>
  );
};
