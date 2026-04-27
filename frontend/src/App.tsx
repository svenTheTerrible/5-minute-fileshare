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
    <Box sx={{ background: "#07071a", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          bgcolor: "#07071a",
          opacity: 0.5,
        }}
      >
        <ColorBends
          colors={["#4F46E5", "#7C3AED", "#C026D3", "#2563EB"]}
          speed={0.15}
          frequency={1.2}
          noise={0.06}
          iterations={2}
          intensity={1.1}
          bandWidth={5}
          transparent={true}
          mouseInfluence={0.8}
          parallax={0.3}
          autoRotate={0.3}
        />
      </Box>
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100vh",
        }}
      >
        <SessionBody
          key={sessionId}
          sessionId={sessionId}
          onNewSession={newSession}
        />
      </Box>
    </Box>
  );
};
