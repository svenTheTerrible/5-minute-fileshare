import type { FC } from "react";
import type { TransferFile } from "../../hooks/useWebRTCFileShare";
import { Box, Grid } from "@mui/material";
import { PixelCard } from "../../stories/PixelCard";
import { theme } from "../../stories/theme";
import { PixelButton } from "../../stories/PixelButton";
import { PixelProgress } from "../../stories/PixelProgress";

interface FileTileProps {
  file: TransferFile;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export const FileTile: FC<FileTileProps> = ({ file }) => {
  const isReceive = file.transferDirection === "receive";

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!file.data) return;
    const url = URL.createObjectURL(file.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFileType = (fileName: string) => {
    const fileNameSplit = fileName.split(".");

    return fileNameSplit.length > 1
      ? fileNameSplit[fileNameSplit.length - 1]
      : "txt";
  };

  return (
    <Grid size={{ xs: 12, md: 4, lg: 3 }} onClick={handleDownload}>
      <PixelCard
        media={
          <Box
            sx={{
              background: isReceive ? theme.accent2 : theme.accent,
              height: 8,
            }}
          />
        }
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <PixelButton variant={isReceive ? "outline2" : "outline"} size="sm">
            {isReceive ? "↓ RECEIVE" : "↑ SENT"}
          </PixelButton>
          {file.completion === 100 ? (
            <Box sx={{ color: theme.textFaint }}>DONE</Box>
          ) : null}
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              minWidth: 48,
              width: 48,
              height: 48,
              minHeight: 48,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${isReceive ? theme.accent2 : theme.accent}`,
              mr: 2,
            }}
          >
            {getFileType(file.name)}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box>{file.name}</Box>
            <Box sx={{ color: theme.textFaint, lineHeight: 1.5 }}>
              {formatSize(file.size)}
            </Box>
          </Box>
        </Box>

        <Box>
          <PixelProgress
            value={file.completion}
            fillColor={isReceive ? theme.accent2 : theme.accent}
          ></PixelProgress>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>{file.completion >= 100 ? "COMPLETED" : ""}</Box>
          {isReceive && (
            <PixelButton
              variant={isReceive ? "outline2" : "outline"}
              size="sm"
              onClick={handleDownload}
            >
              SAVE
            </PixelButton>
          )}
        </Box>
      </PixelCard>
    </Grid>
  );
};
