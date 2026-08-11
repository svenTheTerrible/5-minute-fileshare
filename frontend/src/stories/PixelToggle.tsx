import React from "react";
import { theme, sx } from "./theme";

interface PixelToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const PixelToggle: React.FC<PixelToggleProps> = ({
  checked = false,
  onChange,
  label,
  disabled,
  style,
}) => (
  <div
    role="switch"
    aria-checked={checked}
    tabIndex={disabled ? -1 : 0}
    onClick={() => !disabled && onChange && onChange(!checked)}
    onKeyDown={(e) => {
      if (!disabled && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        onChange && onChange(!checked);
      }
    }}
    style={sx(
      {
        display: "flex",
        alignItems: "center",
        gap: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      },
      style,
    )}
  >
    <div
      style={{
        width: 52,
        height: 26,
        boxSizing: "border-box",
        padding: 2,
        display: "flex",
        alignItems: "center",
        border: `3px solid ${checked ? theme.accent : theme.lineStrong}`,
        background: checked ? theme.accentWash : theme.surfaceDeep,
        transition: "border-color .15s ease, background .15s ease",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          background: checked ? theme.accent : theme.textFaint,
          transform: `translateX(${checked ? 24 : 0}px)`,
          transition: "transform .15s steps(4), background .15s ease",
        }}
      />
    </div>
    {label && (
      <span
        style={{ fontFamily: theme.body, fontSize: 15, color: theme.textBody }}
      >
        {label}
      </span>
    )}
  </div>
);
