// Four small drawings about clarity, direction, a next step, and support.
// Decorative SVG keeps the artwork sharp and inherits the editable brand colors.
export default function PathGlyph({ index }: { index: number }) {
  return (
    <svg className="path-glyph" viewBox="0 0 120 100" fill="none" aria-hidden="true" focusable="false">
      {index % 4 === 0 && <>
        <circle cx="60" cy="50" r="34" /><circle cx="60" cy="50" r="22" /><circle cx="60" cy="50" r="9" />
        <path d="M60 5V20M60 80V95M15 50H30M90 50H105" />
        <circle className="glyph-point" cx="60" cy="50" r="3" />
      </>}
      {index % 4 === 1 && <>
        <circle cx="60" cy="50" r="37" strokeDasharray="2 6" />
        <path d="M37 74L48 38L84 26L72 62Z" /><path d="M48 38L72 62M37 74L84 26" />
        <circle className="glyph-point" cx="60" cy="50" r="3" />
      </>}
      {index % 4 === 2 && <>
        <path d="M15 78H38V56H61V34H84V12M15 89H100" />
        <path d="M20 60C38 60 27 25 55 25S73 12 84 12M75 12H84V21" strokeDasharray="3 5" />
        <circle className="glyph-point" cx="15" cy="78" r="3" /><circle cx="84" cy="12" r="4" />
      </>}
      {index % 4 === 3 && <>
        <ellipse cx="46" cy="50" rx="28" ry="35" transform="rotate(-28 46 50)" />
        <ellipse cx="74" cy="50" rx="28" ry="35" transform="rotate(28 74 50)" />
        <path d="M60 28V72" strokeDasharray="2 5" /><circle className="glyph-point" cx="60" cy="50" r="3" />
      </>}
    </svg>
  )
}
