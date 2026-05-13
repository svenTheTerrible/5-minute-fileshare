import { useCallback, type FC } from "react";
import { Box, Grid } from "@mui/material";
import type { UseWebRTCFileShare } from "../hooks/useWebRTCFileShare";
import { useDropzone } from "react-dropzone";
import { FileTile } from "./filetile/FileTile";

interface Props {
  fileshare: UseWebRTCFileShare;
}

export const Body: FC<Props> = ({ fileshare }) => {
  const { files, sendFiles } = fileshare;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    sendFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
