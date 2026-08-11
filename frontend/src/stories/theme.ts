export const theme = {
  bg: "#0a0d13",
  surface: "#0f141d",
  surfaceDeep: "#080b11",
  line: "#223047",
  lineSoft: "#1c2634",
  lineStrong: "#33445e",
  text: "#e8f1ff",
  textBody: "#c9d4e4",
  textMuted: "#7a8799",
  textFaint: "#4d5a6d",
  disabled: "#3d4757",
  accent: "#00e5ff",
  accent2: "rgb(169, 123, 255)",
  accentDeep: "#00343d",
  accentWash: "#0b2a31",
  accentInk: "#03181c",
  danger: "#ff4d6d",
  dangerWash: "#2a0f18",
  warn: "#ffb800",
  warnWash: "#2c2308",
  shadow: "#060910",
  display: "'Press Start 2P', monospace",
  body: "Silkscreen, monospace",
};

/** Merge a style object with an optional user-supplied style prop. */
export const sx = (
  ...objs: (React.CSSProperties | undefined)[]
): React.CSSProperties => Object.assign({}, ...objs.filter(Boolean));

/** Hard pixel drop-shadow. */
export const hardShadow = (n = 5, color = theme.shadow) =>
  `${n}px ${n}px 0 ${color}`;
