import { Box } from "@mui/material";
import type { FC } from "react";

export const GlasBackground: FC = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        background: "rgba(255,255,255,.1)",
        border: "2px solid rgba(255,255,255,0.2)",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: 16,
        zIndex: -1,
      }}
    />
  );
};
