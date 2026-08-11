import React, { HTMLAttributes } from "react";
import { theme, sx } from "./theme";
import { usePress } from "./usePress";

interface PixelCardProps extends Omit<HTMLAttributes<"article">, "children"> {
  media?: React.ReactNode;
  interactive?: boolean;
  children?: React.ReactNode;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  media,
  interactive = true,
  style,
  children,
  ...rest
}) => {
  const [{ hover }, handlers] = usePress(!interactive);
  const off = hover ? 9 : 6;
  const shift = hover ? -3 : 0;
  return (
    <article
      {...(interactive ? handlers : {})}
      style={sx(
        {
          background: theme.surface,
          border: `3px solid ${hover ? theme.accent : theme.line}`,
          boxShadow: `${off}px ${off}px 0 ${theme.shadow}`,
          transform: `translate(${shift}px, ${shift}px)`,
          display: "flex",
          flexDirection: "column",
          transition:
            "transform .14s ease, box-shadow .14s ease, border-color .14s ease",
        },
        style,
      )}
      {...rest}
    >
      {media}
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {children}
      </div>
    </article>
  );
};

/** Striped placeholder for a screenshot slot. Pass src to show a real image. */
export const PixelCardMedia: React.FC<{
  src?: string;
  alt?: string;
  caption?: string;
  height?: number;
}> = ({ src, alt = "", caption, height = 112 }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={{
          height,
          width: "100%",
          objectFit: "cover",
          display: "block",
          borderBottom: `3px solid ${theme.line}`,
          imageRendering: "pixelated",
        }}
      />
    );
  }
  return (
    <div
      style={{
        height,
        background: "#0b1018",
        backgroundImage:
          "repeating-linear-gradient(90deg,#131c28 0 8px,#0b1018 8px 16px)",
        borderBottom: `3px solid ${theme.line}`,
        display: "flex",
        alignItems: "flex-end",
        padding: 12,
      }}
    >
      <span
        style={{ fontFamily: theme.display, fontSize: 8, color: "#3f4c60" }}
      >
        {caption || "[ screenshot ]"}
      </span>
    </div>
  );
};

export const PixelCardTitle: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <h3
      style={{
        fontFamily: theme.display,
        fontSize: 12,
        color: theme.text,
        margin: "6px 0 0",
        lineHeight: 1.6,
      }}
    >
      {children}
    </h3>
  );
};

export const PixelCardText: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: theme.body,
        fontSize: 14,
        color: theme.textMuted,
        textWrap: "pretty",
      }}
    >
      {children}
    </p>
  );
};

export const PixelCardFooter: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `2px dashed ${theme.lineSoft}`,
        marginTop: 8,
        paddingTop: 14,
        fontFamily: theme.body,
        fontSize: 13,
        color: theme.textFaint,
      }}
    >
      {children}
    </div>
  );
};
