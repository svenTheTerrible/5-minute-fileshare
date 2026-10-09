# 5-Minute Fileshare

A peer-to-peer file sharing app with a lightweight Go signaling server. Share files between two peers without uploading to a server — the signaling server only exchanges connection metadata.

## Architecture

- **Backend** (`backend/`): Go signaling server using gorilla/websocket. Manages sessions with two peer slots each, relays WebSocket messages between peers. Serves the static frontend build on port 8080.
- **Frontend** (`frontend/`): React 19 + TypeScript SPA built with Vite, MUI v7, and Emotion. Uses WebRTC for peer-to-peer file transfer.

## Development Setup

### Backend

```bash
cd backend
go run main.go
```

Starts the signaling server on `localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run start
```

Starts the Vite dev server on `localhost:5173`. The dev server proxies `/ws` to `localhost:8080`, so the Go backend must also be running.

## Building for Production

```bash
cd frontend && npm run build
cp -r frontend/dist/* backend/static/
cd backend && go build main.go
```

Alternatively, use the provided Dockerfile.

## Tech Stack

- Go 1.26, gorilla/websocket
- React 19, TypeScript, Vite
- MUI v7, Emotion
- React Compiler (babel-plugin-react-compiler)
