import React, { createContext, useCallback, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { theme } from './theme';

type ToastTone = 'accent' | 'warn' | 'danger';

interface ToastItem {
  id: number;
  text: string;
  tone: ToastTone;
}

type PushToast = (text: string, tone?: ToastTone) => void;

const ToastCtx = createContext<PushToast>(() => {});

/** Wrap your app once, then call useToast()(message) anywhere. */
export const PixelToastProvider: React.FC<{ children: React.ReactNode; duration?: number }> = ({ children, duration = 3200 }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<number[]>([]);

  const push = useCallback<PushToast>((text, tone = 'accent') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    timers.current.push(setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration));
  }, [duration]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const color = useMemo(() => ({ accent: theme.accent, warn: theme.warn, danger: theme.danger }), []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{ position: 'fixed', right: 24, bottom: 24, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 70 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 12, minWidth: 280, padding: '14px 18px',
            background: theme.surface, border: `3px solid ${color[t.tone] || theme.accent}`,
            boxShadow: '5px 5px 0 #04070c', animation: 'pixel-in .16s ease-out',
          }}>
            <div style={{ width: 10, height: 10, flex: 'none', background: color[t.tone] || theme.accent }} />
            <span style={{ fontFamily: theme.body, fontSize: 14, color: theme.textBody }}>{t.text}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

export const useToast = (): PushToast => useContext(ToastCtx);
