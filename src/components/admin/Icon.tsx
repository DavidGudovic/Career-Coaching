/**
 * White-label graphic for the admin NAV header (replaces the small Payload mark).
 * Server component — inline styles only (see Logo.tsx). Mirrors public/favicon.svg.
 */
export const Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="26" height="26" aria-label="Jelena Rajković">
    <rect width="64" height="64" rx="14" fill="#1c4e52" />
    <text
      x="50%"
      y="50%"
      dy="2"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontStyle="italic"
      fontSize="30"
      fill="#F2EFE8"
    >
      jr
    </text>
  </svg>
)

export default Icon
