/**
 * White-label graphic for the admin LOGIN screen (replaces the Payload logo).
 * Server component — admin has its own font stack, so use inline styles only;
 * do NOT import the frontend globals.css or next/font here.
 * Colours are light on purpose: the admin runs in dark mode (admin.theme: 'dark').
 */
export const Logo = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      lineHeight: 1.15,
      textAlign: 'center',
    }}
  >
    <span
      style={{
        fontSize: 12,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        color: '#9dc3b6',
        fontWeight: 600,
      }}
    >
      Karijerno iskreno
    </span>
    <strong style={{ fontSize: 30, color: '#f2efe8', fontWeight: 700, letterSpacing: '0.01em' }}>
      Jelena Rajković
    </strong>
  </div>
)

export default Logo
