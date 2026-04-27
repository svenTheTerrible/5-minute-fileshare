import { useState, useCallback, type FC } from "react";
import { Box } from "@mui/material";
import { SessionBody } from "./components/SessionBody";
import { ColorBends } from "./components/background/ColorBends";

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
      <Box
        sx={{
          overflow: "hidden",
          zIndex: 0,
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      >
        <ColorBends
          colors={["#A855F7"]}
          speed={0.2}
          frequency={1.0}
          noise={0.15}
          iterations={1}
          intensity={1.3}
        />
      </Box>
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
