'use client'
import { useEffect, useState } from 'react'

export default function AnalyticsPreference({ english }: { english: boolean }) {
  const [disabled, setDisabled] = useState(false)
  const [blocked, setBlocked] = useState(false)
  useEffect(() => {
    try { setDisabled(localStorage.getItem('umami.disabled') === '1') } catch { setBlocked(true) }
  }, [])
  return <div><button className="btn btn-solid" disabled={blocked} onClick={() => {
    try {
      if (disabled) localStorage.removeItem('umami.disabled')
      else localStorage.setItem('umami.disabled', '1')
      window.location.reload()
    } catch { setBlocked(true) }
  }}>{english ? (disabled ? 'Allow anonymous statistics' : 'Turn off anonymous statistics') : (disabled ? 'Dozvoli anonimnu statistiku' : 'Isključi anonimnu statistiku')}</button>
  <p role="status">{blocked ? (english ? 'Your browser does not allow this preference to be saved.' : 'Pregledač ne dozvoljava čuvanje ove postavke.') : (english ? (disabled ? 'Statistics are turned off in this browser.' : 'You can turn off statistics for this browser.') : (disabled ? 'Statistika je isključena u ovom pregledaču.' : 'Statistiku možeš isključiti za ovaj pregledač.'))}</p></div>
}
