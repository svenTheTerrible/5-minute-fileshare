import type { CSSProperties, ReactNode } from "react";

import { theme, sx } from "./theme";
import { Grid } from "@mui/material";

interface PixelHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  stats?: Array<{ value: string | number; label: string }>;
  align?: "split" | "center";
  grid?: boolean;
  style?: CSSProperties;
}

interface PixelHeroWindowProps {
  title?: string;
  lines?: Array<{ left: ReactNode; right: ReactNode; tone?: "accent" }>;
  children?: ReactNode;
}

export const PixelHero = ({
  eyebrow,
  title,
  subtitle,
  actions,
  aside,
  stats = [],
  align = "split",
  grid = true,
  style,
}: PixelHeroProps) => {
  const centered = align === "center" || !aside;

  return (
    <section
      style={sx(
        {
          position: "relative",
          overflow: "hidden",
          background: theme.surface,
          border: `3px solid ${theme.line}`,
          boxShadow: `8px 8px 0 ${theme.shadow}`,
          padding: "clamp(32px, 5vw, 64px)",
        },
        grid && {
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(0,229,255,0.10), transparent 55%)," +
            "repeating-linear-gradient(0deg, rgba(34,48,71,0.35) 0 1px, transparent 1px 24px)," +
            "repeating-linear-gradient(90deg, rgba(34,48,71,0.35) 0 1px, transparent 1px 24px)",
        },
        style,
      )}
    >
      <ScanCorner />

      <Grid container spacing={1}>
        <Grid size={{ xs: 12, md: 6 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignItems: centered ? "center" : "flex-start",
              maxWidth: centered ? 720 : undefined,
            }}
          >
            {eyebrow && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: theme.accent,
                    boxShadow: `0 8px 0 ${theme.accent}, 8px 0 0 ${theme.accentDeep}`,
                    flex: "none",
                  }}
                />
                <span
                  style={{
                    fontFamily: theme.display,
                    fontSize: 9,
                    letterSpacing: 2,
                    color: theme.accent,
                    marginLeft: 10,
                  }}
                >
                  {eyebrow}
                </span>
              </div>
            )}

            <h1
              style={{
                fontFamily: theme.display,
                fontSize: "clamp(22px, 3.4vw, 40px)",
                lineHeight: 1.5,
                color: theme.text,
                margin: 0,
                textShadow: `0 4px 0 ${theme.accentDeep}`,
                textWrap: "balance",
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                style={{
                  fontFamily: theme.body,
                  fontSize: 16,
                  lineHeight: 1.9,
                  color: theme.textMuted,
                  margin: 0,
                  maxWidth: 560,
                  textWrap: "pretty",
                }}
              >
                {subtitle}
              </p>
            )}

            {actions && (
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  marginTop: 8,
                  justifyContent: centered ? "center" : "flex-start",
                }}
              >
                {actions}
              </div>
            )}

            {stats.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  flexWrap: "wrap",
                  marginTop: 20,
                  borderTop: `2px dashed ${theme.lineSoft}`,
                  paddingTop: 22,
                  width: "100%",
                  justifyContent: centered ? "center" : "flex-start",
                }}
              >
                {stats.map((s, i) => (
                  <div
                    key={`${s.label}-${i}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      padding: "0 clamp(16px, 2.5vw, 32px)",
                      borderLeft:
                        i === 0 ? "none" : `2px solid ${theme.lineSoft}`,
                      paddingLeft: i === 0 ? 0 : undefined,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: theme.display,
                        fontSize: 15,
                        color: theme.accent,
                      }}
                    >
                      {s.value}
                    </span>
                    <span
                      style={{
                        fontFamily: theme.body,
                        fontSize: 13,
                        color: theme.textFaint,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", alignItems: "center" }}
        >
          {aside}
        </Grid>
      </Grid>
    </section>
  );
};

export const PixelHeroWindow = ({
  title = "peer://8f2a…c41",
  lines = [],
  children,
}: PixelHeroWindowProps) => (
  <div
    style={{
      background: theme.surfaceDeep,
      border: `3px solid ${theme.accent}`,
      boxShadow: `8px 8px 0 #04070c`,
      width: "100%",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderBottom: `3px solid ${theme.line}`,
        background: "#0c1119",
      }}
    >
      <span style={{ width: 8, height: 8, background: theme.danger }} />
      <span style={{ width: 8, height: 8, background: theme.warn }} />
      <span style={{ width: 8, height: 8, background: theme.accent }} />
      <span
        style={{
          fontFamily: theme.display,
          fontSize: 8,
          color: theme.textMuted,
          marginLeft: 10,
        }}
      >
        {title}
      </span>
    </div>
    <div
      style={{
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: theme.body,
        fontSize: 14,
      }}
    >
      {lines.map((l) => (
        <div
          key={l.left}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            color: theme.textMuted,
          }}
        >
          <span>{l.left}</span>
          <span
            style={{
              color: l.tone === "accent" ? theme.accent : theme.textBody,
            }}
          >
            {l.right}
          </span>
        </div>
      ))}
      {children}
    </div>
  </div>
);

const ScanCorner = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      right: 0,
      width: 72,
      height: 72,
      pointerEvents: "none",
      opacity: 0.7,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 48,
        height: 6,
        background: theme.accent,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 6,
        height: 48,
        background: theme.accent,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 14,
        right: 14,
        width: 24,
        height: 4,
        background: theme.accentDeep,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 14,
        right: 14,
        width: 4,
        height: 24,
        background: theme.accentDeep,
      }}
    />
  </div>
);
