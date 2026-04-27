import { useCallback, type FC } from "react";
import { Box, Grid } from "@mui/material";
import type { UseWebRTCFileShare } from "../hooks/useWebRTCFileShare";
import { useDropzone } from "react-dropzone";
import { FileTile } from "./filetile/FileTile";

function toHumanReadableFileSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1_048_576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1_048_576).toFixed(1)} MB`;
}

interface Props {
  fileshare: UseWebRTCFileShare;
}

export const Body: FC<Props> = ({ fileshare }) => {
  const { files, sendFiles } = fileshare;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    sendFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box {...getRootProps()} sx={{ height: "100%", width: "100%", p: 3 }}>
      <input {...getInputProps()} />
      <Grid container spacing={3}>
        {files.map((file) => (
          <FileTile key={file.id} file={file} />
        ))}
      </Grid>
    </Box>
  );
};
