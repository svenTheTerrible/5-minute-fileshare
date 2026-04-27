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

function getFileIcon(name: string, color: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const imageExts = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico", "tiff"];
  const videoExts = ["mp4", "mkv", "avi", "mov", "webm", "flv", "wmv"];
  const audioExts = ["mp3", "wav", "flac", "ogg", "aac", "m4a", "opus"];
  const archiveExts = ["zip", "tar", "gz", "bz2", "rar", "7z", "xz"];
  const codeExts = ["js", "ts", "jsx", "tsx", "py", "java", "c", "cpp", "cs", "go", "rs", "rb", "php", "html", "css", "json", "yaml", "yml", "xml", "sh"];
  const textExts = ["txt", "md", "csv", "log", "ini", "cfg", "toml"];

  const sx = { fontSize: 48, color, filter: `drop-shadow(0 0 8px ${color})` };

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
  const isReceive = file.transferDirection === "receive";
  const accentColor = isReceive ? "green" : "cyan";
  const progressColor = isReceive ? "success" : "info";
  const completionPct = Math.round(file.completion * 100);

  // stained-glass pane colour per direction
  const iconColor = isReceive ? "#86efac" : "#67e8f9";
  const glassTint = isReceive ? "rgba(34,197,94,0.10)" : "rgba(6,182,212,0.10)";
  const glassHighlight = isReceive ? "rgba(134,239,172,0.18)" : "rgba(103,232,249,0.18)";

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
        chaos={completionPct < 100 ? 0.12 : 0}
        style={{ borderRadius: 16 }}
      >
        <Box
          sx={{
            height: 200,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: `linear-gradient(145deg, ${glassHighlight} 0%, ${glassTint} 100%)`,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
            {getFileIcon(file.name, iconColor)}
          </Box>

          <Box>
            <Typography
              variant="body2"
              noWrap
              title={file.name}
              sx={{ fontWeight: 600, mb: 0.25, color: "rgba(255,255,255,0.95)" }}
            >
              {file.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
              {formatSize(file.size)}
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                {completionPct < 100 ? (isReceive ? "Receiving…" : "Transferring…") : "Done"}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                {completionPct}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionPct}
              color={progressColor}
              sx={{ borderRadius: 4, opacity: 0.85 }}
            />
          </Box>
        </Box>
      </ElectricBorder>
    </Grid>
  );
};
