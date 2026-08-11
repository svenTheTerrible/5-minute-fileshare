import React from 'react';
import { theme, sx } from './theme';

/** Stepped block bar. value 0–100, or indeterminate. */
export const PixelProgress: React.FC<{
  value?: number;
  blocks?: number;
  label?: string;
  right?: string;
  footerLeft?: string;
  footerRight?: string;
  indeterminate?: boolean;
  style?: React.CSSProperties;
}> = ({ value = 0, blocks = 20, label, right, footerLeft, footerRight, indeterminate = false, style }) => {
  const filled = Math.round((Math.min(100, Math.max(0, value)) / 100) * blocks);
  return (
    <div style={sx({ display: 'flex', flexDirection: 'column', gap: 12 }, style)}>
      {(label || right) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.display, fontSize: 9, color: theme.textMuted }}>
          <span>{label}</span>
          <span style={{ color: theme.accent }}>{right}</span>
        </div>
      )}

      {indeterminate ? (
        <div style={{
          height: 22, border: '3px solid #2b3a4f', background: theme.surfaceDeep, opacity: 0.85,
          backgroundImage: `repeating-linear-gradient(90deg,${theme.accent} 0 8px,transparent 8px 16px)`,
          animation: 'pixel-stripes .6s linear infinite',
        }} />
      ) : (
        <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}
          style={{ display: 'flex', gap: 3, background: theme.surfaceDeep, border: '3px solid #2b3a4f', padding: 5 }}>
          {Array.from({ length: blocks }, (_, i) => (
            <div key={i} style={{
              flex: 1, height: 20,
              background: i < filled ? theme.accent : '#151d29',
              boxShadow: i < filled ? '0 0 8px rgba(0,229,255,0.35)' : 'none',
              transition: 'background .2s steps(2)',
            }} />
          ))}
        </div>
      )}

      {(footerLeft || footerRight) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: theme.body, fontSize: 13, color: theme.textFaint }}>
          <span>{footerLeft}</span><span>{footerRight}</span>
        </div>
      )}
    </div>
  );
}
