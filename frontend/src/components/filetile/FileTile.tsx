import type { FC } from "react";
import type { TransferFile } from "../../hooks/useWebRTCFileShare";
import { ElectricBorder } from "./ElectricBorder";
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import CodeIcon from "@mui/icons-material/Code";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import VideoFileIcon from "@mui/icons-material/VideoFile";

interface FileTileProps {
  file: TransferFile;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const imageExts = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico", "tiff"];
  const videoExts = ["mp4", "mkv", "avi", "mov", "webm", "flv", "wmv"];
  const audioExts = ["mp3", "wav", "flac", "ogg", "aac", "m4a", "opus"];
  const archiveExts = ["zip", "tar", "gz", "bz2", "rar", "7z", "xz"];
  const codeExts = ["js", "ts", "jsx", "tsx", "py", "java", "c", "cpp", "cs", "go", "rs", "rb", "php", "html", "css", "json", "yaml", "yml", "xml", "sh"];
  const textExts = ["txt", "md", "csv", "log", "ini", "cfg", "toml"];

  const sx = { fontSize: 48, opacity: 0.85 };

  if (ext === "pdf") return <PictureAsPdfIcon sx={sx} />;
  if (imageExts.includes(ext)) return <ImageIcon sx={sx} />;
  if (videoExts.includes(ext)) return <VideoFileIcon sx={sx} />;
  if (audioExts.includes(ext)) return <AudioFileIcon sx={sx} />;
  if (archiveExts.includes(ext)) return <FolderZipIcon sx={sx} />;
  if (codeExts.includes(ext)) return <CodeIcon sx={sx} />;
  if (textExts.includes(ext)) return <TextSnippetIcon sx={sx} />;
  return <InsertDriveFileIcon sx={sx} />;
}

export const FileTile: FC<FileTileProps> = ({ file }) => {
  const accentColor = file.transferDirection === "receive" ? "green" : "cyan";
  const progressColor = file.transferDirection === "receive" ? "success" : "info";
  const completionPct = Math.round(file.completion * 100);

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

  return (
    <Grid size={{ xs: 6, md: 2, lg: 1.5 }} onClick={handleDownload}>
      <ElectricBorder
        color={accentColor}
        speed={1}
        chaos={0.12}
        style={{ borderRadius: 16 }}
      >
        <Box
          sx={{
            height: 200,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
            {getFileIcon(file.name)}
          </Box>

          <Box>
            <Typography
              variant="body2"
              noWrap
              title={file.name}
              sx={{ fontWeight: 600, mb: 0.25 }}
            >
              {file.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              {formatSize(file.size)}
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                {completionPct < 100 ? "Transferring…" : "Done"}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                {completionPct}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionPct}
              color={progressColor}
              sx={{ borderRadius: 4 }}
            />
          </Box>
        </Box>
      </ElectricBorder>
    </Grid>
  );
};
