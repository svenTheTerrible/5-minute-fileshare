import React, {
  CSSProperties,
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useState,
} from "react";
import { theme, sx } from "./theme";

const fieldBase: CSSProperties = {
  fontFamily: theme.body,
  fontSize: 16,
  padding: 14,
  background: theme.surfaceDeep,
  color: theme.text,
  border: `3px solid #2b3a4f`,
  borderRadius: 0,
  outline: "none",
  width: "100%",
  boxSizing: "border-box" as const,
  transition: "border-color .15s ease, box-shadow .15s ease",
};

const useField = ({
  error,
  disabled,
}: {
  error?: string;
  disabled?: boolean;
}) => {
  const [focus, setFocus] = useState(false);
  const state = disabled
    ? { background: "#0c1017", color: theme.disabled, borderColor: "#1a222e" }
    : error
      ? { background: "#150a0e", color: "#ff9db0", borderColor: theme.danger }
      : focus
        ? {
            borderColor: theme.accent,
            boxShadow: "0 0 0 3px rgba(0,229,255,0.18)",
          }
        : null;
  return [
    state,
    { onFocus: () => setFocus(true), onBlur: () => setFocus(false) },
  ] as const;
};

export const PixelLabel: React.FC<{
  children?: React.ReactNode;
  tone?: "error" | "disabled" | "muted";
}> = ({ children, tone = "muted" }) => {
  const color =
    tone === "error"
      ? "#ff6b85"
      : tone === "disabled"
        ? theme.disabled
        : theme.textMuted;
  return (
    <span
      style={{
        fontFamily: theme.display,
        fontSize: 8,
        letterSpacing: 1,
        color,
        lineHeight: 1.8,
      }}
    >
      {children}
    </span>
  );
};

export const PixelInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    hint?: string;
  }
>((props, ref) => {
  const { label, error, hint, disabled, style, ...rest } = props;
  const [state, focusHandlers] = useField({ error, disabled });
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {label && (
        <PixelLabel tone={error ? "error" : disabled ? "disabled" : "muted"}>
          {label}
        </PixelLabel>
      )}
      <input
        ref={ref}
        disabled={disabled}
        style={sx(fieldBase, state ?? undefined, style)}
        {...focusHandlers}
        {...rest}
      />
      {(error || hint) && (
        <span
          style={{
            fontFamily: theme.body,
            fontSize: 13,
            color: error ? "#ff6b85" : theme.textFaint,
          }}
        >
          {error ? `! ${error}` : hint}
        </span>
      )}
    </label>
  );
});

export const PixelTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  }
>((props, ref) => {
  const { label, error, disabled, rows = 4, style, ...rest } = props;
  const [state, focusHandlers] = useField({ error, disabled });
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {label && (
        <PixelLabel tone={error ? "error" : "muted"}>{label}</PixelLabel>
      )}
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        style={sx(
          fieldBase,
          { fontSize: 15, resize: "vertical" },
          state ?? undefined,
          style,
        )}
        {...focusHandlers}
        {...rest}
      />
    </label>
  );
});
