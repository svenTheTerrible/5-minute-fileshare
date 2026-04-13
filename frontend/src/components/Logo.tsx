export const Logo = ({ height = 36 }: { height?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 158 40"
      height={height}
      style={{ display: "block" }}
      aria-label="RTC Share"
    >
      <defs>
        <linearGradient id="logo-bolt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="logo-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* RTC */}
      <text
        x="0"
        y="30"
        fontFamily="'Roboto Mono', 'Courier New', monospace"
        fontSize="24"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        RTC
      </text>

      {/* Lightning bolt */}
      <path
        transform="translate(52, 2)"
        d="M 11,0 L 3,18 L 9,18 L 4,36 L 18,14 L 12,14 Z"
        fill="url(#logo-bolt)"
        filter="url(#logo-glow)"
      />

      {/* SHARE */}
      <text
        x="80"
        y="30"
        fontFamily="'Roboto Mono', 'Courier New', monospace"
        fontSize="24"
        fontWeight="700"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        SHARE
      </text>
    </svg>
  );
};
