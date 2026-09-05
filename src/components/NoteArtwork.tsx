// Original cover studies for notes without an uploaded photograph.
// A stable slug selects the drawing; no random values or hydration mismatch.
export default function NoteArtwork({ seed }: { seed: string }) {
  const variant = Array.from(seed).reduce((sum, letter) => sum + letter.codePointAt(0)!, 0) % 3
  return (
    <div className={`note-artwork note-artwork-${variant}`} aria-hidden="true">
      <svg viewBox="0 0 600 400" fill="none" focusable="false">
        <path className="note-registration" d="M28 48V28H48M552 28H572V48M572 352V372H552M48 372H28V352" />
        <g className="note-drawing">
          {variant === 0 && <>
            {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx="300" cy="200" rx={60 + i * 10} ry={120 - i * 3} transform={`rotate(${i * 12} 300 200)`} />)}
            <circle cx="300" cy="200" r="5" fill="currentColor" />
          </>}
          {variant === 1 && <>
            {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${80 + i * 40} 420C${40 + i * 30} 300 ${100 + i * 22} 240 300 195C${410 + i * 10} 150 ${410 + i * 9} 65 ${280 + i * 10} -20`} />)}
            <circle cx="300" cy="195" r="8" fill="currentColor" />
            <circle cx="300" cy="195" r="24" strokeDasharray="2 6" />
          </>}
          {variant === 2 && <>
            {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${170 - i * 10} 340V185A${130 + i * 10} ${130 + i * 10} 0 0 1 ${430 + i * 10} 185V340`} />)}
            <path d="M100 340H510M300 110V350" strokeDasharray="2 7" />
            <circle cx="300" cy="216" r="35" /><circle cx="300" cy="216" r="6" fill="currentColor" />
          </>}
        </g>
      </svg>
    </div>
  )
}
