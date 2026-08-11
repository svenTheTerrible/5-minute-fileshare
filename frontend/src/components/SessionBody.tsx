import { type FC } from "react";
import { Body } from "./FileShareSession";
import { Box } from "@mui/material";
import { useWebRTCFileShare } from "../hooks/useWebRTCFileShare";
import { HeaderBar } from "./headerBar/HeaderBar";
import { HeroPage } from "./hero/HeroPage";
import { useEffectOnce } from "../hooks/useEffectOnce";

interface SessionBodyProps {
  sessionId: string;
}

export const SessionBody: FC<SessionBodyProps> = ({ sessionId }) => {
  const fileshare = useWebRTCFileShare(sessionId);

  useEffectOnce(() => {
    fileshare.connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showHeroPage =
    fileshare.phase === "waiting" || fileshare.phase === "idle";

  if (showHeroPage) {
    return <HeroPage sessionId={sessionId} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <HeaderBar fileshare={fileshare} />
      <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
        <Body fileshare={fileshare} />
      </Box>
    </Box>
  );
};
