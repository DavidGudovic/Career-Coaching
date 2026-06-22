/**
 * White-label graphic for the admin LOGIN screen (replaces the Payload logo).
 * Server component — admin has its own font stack, so use inline styles only;
 * do NOT import the frontend globals.css or next/font here.
 */
export const Logo = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.1 }}>
    <span
      style={{
        fontSize: 12,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: '#2c636a',
        fontWeight: 600,
      }}
    >
      Karijerno iskreno
    </span>
    <strong style={{ fontSize: 30, color: '#1c4e52', fontWeight: 700 }}>Jelena Rajković</strong>
  </div>
)

export default Logo
