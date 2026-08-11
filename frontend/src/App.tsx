import { useState, type FC } from "react";
import { SessionBody } from "./components/SessionBody";

function initSession(): string {
  const fromUrl = new URLSearchParams(location.search).get("session");
  if (fromUrl) return fromUrl;
  const id = crypto.randomUUID();
  history.replaceState(null, "", `?session=${id}`);
  return id;
}

export const App: FC = () => {
  const [sessionId] = useState(initSession);

  return <SessionBody key={sessionId} sessionId={sessionId} />;
};
