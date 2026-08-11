import { Box, Tooltip } from "@mui/material";
import { FC, useState } from "react";
import { PixelHero } from "../../stories/PixelHero";
import { HeroPageUploadCard } from "./HeroPageUploadCard";
import { PixelButton } from "../../stories/PixelButton";
import { PixelModal } from "../../stories/PixelModal";
import { QRCodeSVG } from "qrcode.react";
import { theme } from "../../stories/theme";

interface HeroPageProps {
  sessionId: string;
}

export const HeroPage: FC<HeroPageProps> = ({ sessionId }) => {
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [showCopied, setShowCopied] = useState<boolean>(false);

  const joinUrl = `${location.origin}/?session=${sessionId}`;

  const copyJoinUrl = () => {
    setShowCopied(true);
    navigator.clipboard.writeText(joinUrl);
    window.setTimeout(() => setShowCopied(false), 1000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <PixelModal
        open={showQrCode}
        onClose={() => setShowQrCode(false)}
        title="SHARE URL TO START SESSION"
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <QRCodeSVG
            bgColor={theme.bg}
            fgColor={theme.accent}
            value={joinUrl}
            size={220}
          />
        </Box>
        <Tooltip title={showCopied ? "Kopiert!" : undefined}>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <PixelButton style={{ width: "100%" }} onClick={copyJoinUrl}>
              COPY URL
            </PixelButton>
          </Box>
        </Tooltip>
      </PixelModal>
      <PixelHero
        title="SEND FILES PEER TO PEER"
        eyebrow="NO SERVER. NO LIMIT."
        align="split"
        grid
        style={{ maxWidth: 800 }}
        aside={<HeroPageUploadCard />}
        actions={
          <PixelButton onClick={() => setShowQrCode(true)}>
            START SESSION
          </PixelButton>
        }
        subtitle="We open a direct WebRTC data channel between two browsers. Files never touch a server — not even ours."
      ></PixelHero>
    </Box>
  );
};
