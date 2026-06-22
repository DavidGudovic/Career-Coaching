/**
 * White-label graphic for the admin NAV header (replaces the small Payload mark).
 * Mirrors Payload's own icon: className "graphic-icon" + width/height 100% so it
 * SCALES to whatever box the nav gives it (a fixed px size overflows and gets
 * clipped). Server component, inline/SVG only. Brand "jr" tile, like the favicon.
 */
export const Icon = () => (
  <svg
    className="graphic-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="100%"
    height="100%"
    aria-label="Jelena Rajković"
  >
    <rect width="64" height="64" rx="14" fill="#1c4e52" />
    <text
      x="32"
      y="33"
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontStyle="italic"
      fontWeight="600"
      fontSize="32"
      fill="#f2efe8"
    >
      jr
    </text>
  </svg>
)

export default Icon
