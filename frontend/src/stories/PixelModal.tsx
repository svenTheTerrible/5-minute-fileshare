import React, { useEffect } from "react";
import { theme } from "./theme";

export interface PixelModalProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  footer?: React.ReactNode;
  width?: number;
  children?: React.ReactNode;
}

export const PixelModal: React.FC<PixelModalProps> = ({
  open,
  title,
  onClose,
  footer,
  width = 520,
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && onClose && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(4,7,12,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 60,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: `min(${width}px, 100%)`,
          background: theme.surface,
          border: `4px solid ${theme.accent}`,
          boxShadow: "10px 10px 0 #04070c",
          animation: "pixel-in .16s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: `3px solid ${theme.line}`,
            background: "#0c1119",
          }}
        >
          <span
            style={{
              fontFamily: theme.display,
              fontSize: 10,
              color: theme.accent,
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              fontFamily: theme.display,
              fontSize: 10,
              background: "transparent",
              border: `2px solid ${theme.lineStrong}`,
              color: theme.textMuted,
              padding: "6px 9px",
              cursor: "pointer",
            }}
          >
            X
          </button>
        </div>
        <div
          style={{
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            fontFamily: theme.body,
            fontSize: 15,
            color: theme.textBody,
          }}
        >
          {children}
        </div>
        {footer && (
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "flex-end",
              padding: "0 24px 24px",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
