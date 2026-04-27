import type { FC } from "react";
import type { TransferFile } from "../../hooks/useWebRTCFileShare";
import { ElectricBorder } from "./ElectricBorder";
import { Box, Grid, Typography } from "@mui/material";

interface FileTileProps {
  file: TransferFile;
}

export const FileTile: FC<FileTileProps> = ({ file }) => {
  console.log(file);

  const handleDownload = () => {
    //todo
  };

  return (
    <Grid size={{ xs: 6, md: 2, lg: 1.5 }} onClick={handleDownload}>
      <ElectricBorder
        color={file.transferDirection === "receive" ? "green" : "cyan"}
        speed={1}
        chaos={0.12}
        style={{ borderRadius: 16 }}
      >
        <Box sx={{ height: 200, p: 3 }}>
          <Typography>{file.name}</Typography>
        </Box>
      </ElectricBorder>
    </Grid>
  );
};
