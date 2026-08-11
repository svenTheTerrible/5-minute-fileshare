import React from 'react';
import { theme, sx } from './theme';

type Tone = keyof typeof TONES;

interface BadgeStyle {
  background: string;
  color: string;
  border: string;
}

const TONES: Record<Tone, BadgeStyle> = {
  accent: { background: theme.accentWash, color: theme.accent, border: theme.accent },
  warn: { background: theme.warnWash, color: theme.warn, border: theme.warn },
  danger: { background: theme.dangerWash, color: '#ff6b85', border: theme.danger },
  neutral: { background: '#151b26', color: theme.textMuted, border: theme.lineStrong },
  quiet: { background: '#131b27', color: theme.textMuted, border: theme.line },
};

interface PixelBadgeProps {
  tone?: Tone;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const PixelBadge: React.FC<PixelBadgeProps> = ({ tone = 'accent', children, style }) => {
  const t = TONES[tone] || TONES.accent;
  return (
    <span style={sx({
      fontFamily: theme.display, fontSize: 8, lineHeight: 1.4, padding: '6px 8px',
      background: t.background, color: t.color, border: `2px solid ${t.border}`, display: 'inline-block',
    }, style)}>{children}</span>
  );
};
