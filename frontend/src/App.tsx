import { useState, useCallback, type FC } from "react";
import { Box } from "@mui/material";
import { SessionBody } from "./components/SessionBody";
import { AuroraBackground } from "./components/background/AuroraBackground";

function initSession(): string {
  const fromUrl = new URLSearchParams(location.search).get("session");
  if (fromUrl) return fromUrl;
  const id = crypto.randomUUID();
  history.replaceState(null, "", `?session=${id}`);
  return id;
}

export const App: FC = () => {
  const [sessionId, setSessionId] = useState(initSession);

  const newSession = useCallback(() => {
    const id = crypto.randomUUID();
    history.replaceState(null, "", `?session=${id}`);
    setSessionId(id);
  }, []);

  return (
    <>
      <AuroraBackground />
      <Box
        sx={{
          height: "100vh",
          zIndex: 1,
          position: "relative",
        }}
      >
        <SessionBody
          key={sessionId}
          sessionId={sessionId}
          onNewSession={newSession}
        />
      </Box>
    </>
  );
};
