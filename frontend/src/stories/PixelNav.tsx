import React, { useState } from "react";
import { theme, sx } from "./theme";

interface PixelNavProps {
  brand?: string;
  items?: string[];
  active?: string | null;
  onSelect?: (label: string) => void;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: React.CSSProperties;
}

export const PixelNav: React.FC<PixelNavProps> = ({
  brand,
  items = [],
  active,
  onSelect,
  left,
  right,
  style,
}) => {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div
      style={sx(
        {
          background: theme.surface,
          border: `3px solid ${theme.line}`,
          boxShadow: `6px 6px 0 ${theme.shadow}`,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        },
        style,
      )}
    >
      {brand && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 12,
              height: 12,
              background: theme.accent,
              boxShadow: `0 12px 0 ${theme.accent}, 12px 0 0 #1b2634`,
              marginRight: 16,
            }}
          />
          <span
            style={{
              fontFamily: theme.display,
              fontSize: 11,
              color: theme.text,
            }}
          >
            {brand}
          </span>
        </div>
      )}
      {left}
      <nav
        style={{
          display: "flex",
          gap: 6,
          marginLeft: "auto",
          flexWrap: "wrap",
        }}
      >
        {items.map((label) => {
          const on = label === active;
          return (
            <button
              key={label}
              onClick={() => onSelect && onSelect(label)}
              onMouseEnter={() => setHover(label)}
              onMouseLeave={() => setHover(null)}
              style={{
                fontFamily: theme.display,
                fontSize: 9,
                padding: "11px 13px",
                cursor: "pointer",
                border: `2px solid ${on ? theme.accent : "transparent"}`,
                background: on
                  ? theme.accentWash
                  : hover === label
                    ? "#182234"
                    : "transparent",
                color: on
                  ? theme.accent
                  : hover === label
                    ? theme.text
                    : theme.textMuted,
                transition: "color .12s ease, background .12s ease",
              }}
            >
              {label}
            </button>
          );
        })}
      </nav>
      {right}
    </div>
  );
};

export const PixelAvatar: React.FC<{
  children?: React.ReactNode;
  size?: number;
}> = ({ children, size = 30 }) => (
  <div
    style={{
      width: size,
      height: size,
      background: theme.accentDeep,
      border: `2px solid ${theme.accent}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.display,
      fontSize: Math.round(size / 3.3),
      color: theme.accent,
    }}
  >
    {children}
  </div>
);
