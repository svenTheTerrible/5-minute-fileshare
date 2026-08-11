import React, { forwardRef } from "react";
import { theme, sx } from "./theme";
import { usePress } from "./usePress";
import "./pixel-ui.css";

type Size = keyof typeof SIZES;
type Variant = keyof typeof VARIANTS;

interface PixelButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "variant"
> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const SIZES: Record<
  string,
  { fontSize: number; padding: string; border: number; lift: number }
> = {
  sm: { fontSize: 8, padding: "9px 12px", border: 2, lift: 3 },
  md: { fontSize: 10, padding: "14px 20px", border: 3, lift: 5 },
  lg: { fontSize: 13, padding: "20px 28px", border: 4, lift: 7 },
};

type VariantStyle = {
  background: string;
  color: string;
  borderColor: string;
  shadow: string | null;
  hoverBorder?: string;
  dashed?: boolean;
  hoverColor?: string;
};

const VARIANTS: Record<string, VariantStyle> = {
  primary: {
    background: theme.accent,
    color: theme.accentInk,
    borderColor: theme.accentInk,
    shadow: theme.accentDeep,
  },
  secondary: {
    background: "#131b27",
    color: theme.textBody,
    borderColor: theme.lineStrong,
    shadow: "#070b12",
    hoverBorder: theme.accent,
  },
  outline: {
    background: "#131b27",
    color: theme.accent,
    borderColor: theme.accent,
    shadow: "#070b12",
  },
  danger: {
    background: theme.dangerWash,
    color: "#ff6b85",
    borderColor: theme.danger,
    shadow: "#1a060d",
  },
  ghost: {
    background: "transparent",
    color: theme.textMuted,
    borderColor: theme.lineStrong,
    shadow: null,
    dashed: true,
    hoverColor: theme.accent,
  },
};

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  (props, ref) => {
    const {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      style,
      children,
      ...rest
    } = props;
    const s = SIZES[size] || SIZES.md;
    const v = VARIANTS[variant] || VARIANTS.primary;
    const [{ hover, active }, handlers] = usePress(disabled || loading);
    const off = v.shadow ? (active ? 1 : hover ? s.lift + 2 : s.lift) : 0;
    const shift = v.shadow ? (active ? s.lift - 2 : hover ? -2 : 0) : 0;

    const base: React.CSSProperties = {
      fontFamily: theme.display,
      fontSize: s.fontSize,
      lineHeight: 1.6,
      padding: s.padding,
      border: `${s.border}px ${v.dashed ? "dashed" : "solid"} ${hover && v.hoverBorder ? v.hoverBorder : v.borderColor}`,
      borderRadius: 0,
      background: v.background,
      color: hover && v.hoverColor ? v.hoverColor : v.color,
      boxShadow: v.shadow ? `${off}px ${off}px 0 ${v.shadow}` : "none",
      transform: `translate(${shift}px, ${shift}px)`,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      transition:
        "transform .12s ease, box-shadow .12s ease, border-color .12s ease, color .12s ease",
    };

    const off_ = disabled
      ? {
          background: "#111721",
          color: theme.disabled,
          border: `${s.border}px solid #1e2735`,
          boxShadow: "none",
          transform: "none",
        }
      : null;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={sx(base, off_, style)}
        {...handlers}
        {...rest}
      >
        {loading && <Blinker />}
        {children ?? "Button"}
      </button>
    );
  },
);

const Blinker: React.FC = () => (
  <span
    style={{
      width: 10,
      height: 10,
      background: "currentColor",
      display: "inline-block",
      animation: "pixel-blink 1s steps(1) infinite",
    }}
  />
);
