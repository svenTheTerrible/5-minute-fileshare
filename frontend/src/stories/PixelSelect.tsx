import React, { useEffect, useRef, useState } from 'react';
import { theme, sx } from './theme';
import { PixelLabel } from './PixelInput';

type Option = string | { label: string; value: string };

interface PixelSelectProps {
  label?: string;
  options?: Option[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** options: string[] | {label, value}[] */
export const PixelSelect: React.FC<PixelSelectProps> = ({ label, options = [], value, onChange, disabled, style }) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const ref = useRef(null);
  const items = options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o));
  const current = items.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={ref} style={sx({ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }, style)}>
      {label && <PixelLabel>{label}</PixelLabel>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        style={{
          fontFamily: theme.body, fontSize: 16, padding: 14, background: theme.surfaceDeep,
          color: disabled ? theme.disabled : theme.text,
          border: `3px solid ${open ? theme.accent : '#2b3a4f'}`, borderRadius: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
          transition: 'border-color .15s ease',
        }}
      >
        <span>{current ? current.label : 'Select…'}</span>
        <span style={{ color: theme.accent, fontSize: 13 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
            background: '#0d121b', border: `3px solid ${theme.accent}`, boxShadow: '6px 6px 0 #04070c',
          }}
        >
          {items.map((o) => (
            <div
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              onMouseEnter={() => setHover(o.value)}
              onMouseLeave={() => setHover(null)}
              onClick={() => { onChange && onChange(o.value); setOpen(false); }}
              style={{
                padding: '13px 14px', cursor: 'pointer', fontFamily: theme.body, fontSize: 15,
                color: o.value === value || hover === o.value ? theme.accent : theme.textBody,
                background: hover === o.value ? '#16202e' : 'transparent',
                borderBottom: '2px solid #16202e',
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
