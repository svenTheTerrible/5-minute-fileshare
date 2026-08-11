import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/ws": {
        target: "http://localhost:8080",
        ws: true,
      },
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    checker({
      // Enable TypeScript type checking
      typescript: true,
      // Show errors as overlay in browser
      overlay: true,
    }),
  ],
});
