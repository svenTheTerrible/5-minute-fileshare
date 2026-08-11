import React from 'react';
import { theme, sx } from './theme';

type Tone = keyof typeof TONES;

const TONES: Record<Tone, { color: string; wash: string; tag: string }> = {
  success: { color: theme.accent, wash: theme.accentWash, tag: 'OK' },
  warn: { color: theme.warn, wash: theme.warnWash, tag: '!' },
  error: { color: theme.danger, wash: theme.dangerWash, tag: 'X' },
};

interface PixelAlertProps {
  tone?: Tone;
  tag?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const PixelAlert: React.FC<PixelAlertProps> = ({ tone = 'success', tag, children, style }) => {
  const t = TONES[tone] || TONES.success;
  return (
    <div role="status" style={sx({
      display: 'flex', alignItems: 'center', gap: 14,
      background: theme.surface, border: `3px solid ${t.color}`, borderLeftWidth: 10, padding: '14px 18px',
    }, style)}>
      <div style={{
        fontFamily: theme.display, fontSize: 9, width: 26, height: 26, flex: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.wash, color: t.color,
      }}>{tag || t.tag}</div>
      <span style={{ fontFamily: theme.body, fontSize: 15, color: theme.textBody }}>{children}</span>
    </div>
  );
};
