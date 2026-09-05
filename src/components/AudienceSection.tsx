import { Emphasis } from '@/lib/emphasis'
import ThreadStudy from './animations/ThreadStudy'

// Blank lines separate paragraphs. Within a paragraph, individual lines become
// statements. Keep the existing CMS field useful for both lists and plain prose.
export default function AudienceSection({ heading, text }: { heading?: string | null; text?: string | null }) {
  const blocks = (text || '').split(/\r?\n\s*\r?\n/)
    .map((block) => block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length)
  const hasStatements = blocks.some((lines) => lines.length > 1)
  const intro = hasStatements && blocks[0]?.length === 1 ? blocks.shift()?.[0] : null
  const closing = hasStatements && blocks.at(-1)?.length === 1 ? blocks.pop()?.[0] : null

  return (
    <section className={`bg-paper section-sm audience-section${hasStatements ? '' : ' audience-section-prose'}`} aria-labelledby="audience-heading">
      <div className="wrap-narrow">
        <div className="audience-heading">
          <h2 id="audience-heading" data-reveal><Emphasis text={heading} /></h2>
          {intro && <p className="audience-intro" data-reveal data-reveal-delay="80"><Emphasis text={intro} /></p>}
        </div>

        <div className="audience-body">
          {!hasStatements && <ThreadStudy />}
          {blocks.map((lines, blockIndex) => lines.length > 1 ? (
            <ul className="audience-statements" key={blockIndex}>
              {lines.map((line, index) => (
                <li key={index} data-reveal data-reveal-delay={(index % 2) * 70}>
                  <span className="audience-mark" aria-hidden="true" />
                  <span><Emphasis text={line} /></span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="audience-prose" key={blockIndex} data-reveal><Emphasis text={lines[0]} /></p>
          ))}
        </div>

        {closing && (
          <div className="audience-reflection">
            <ThreadStudy />
            <p data-reveal><Emphasis text={closing} /></p>
          </div>
        )}
      </div>
    </section>
  )
}
