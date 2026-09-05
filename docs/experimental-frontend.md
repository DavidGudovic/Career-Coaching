# Experimental frontend

Branch: `experimental/frontend`, based on the current `main` release (`c128c94`).

The design uses the idea of finding a personal path: contours, small navigation drawings, and lines that meet. It keeps the site's existing palette, typefaces, CMS copy, and uploaded photography.

## What to try

- **Homepage:** the arched portrait, offset outline and paper note; the numbered empathy list; the framed story photograph. Move your pointer across the story section to gently reshape the contour drawing. On a phone, the drawing follows your scroll.
- **Mentoring cards:** hover or keyboard-focus a card. The paper surface becomes teal, the drawing turns slightly, and the arrow leads to the mentoring page.
- **Journal:** posts without cover photos get one of three original SVG cover studies, selected consistently from the post slug. Hover to move the drawing. Uploaded covers still take priority.
- **Inner pages:** contour artwork sits behind the existing hero ribbons. The mentoring journey connects its numbered steps horizontally on desktop and vertically on phones.
- **Closing invitations:** two contour fields respond around the text, and a small meeting-point illustration draws itself as the section enters view.

## Review by change

| Commit | Design group |
| --- | --- |
| `7c79805` | Homepage composition, illustrated mentoring cards, interactive contour component |
| `4a89620` | Journal illustrations and cover interactions |
| `f63214b` | Inner-page contours, mentoring journey, closing invitations |
| Final refinement commit | Mobile scrolling, motion lifecycle, narrow-phone layout and document-language fixes, this guide |

The groups share `artistry.css`, imported by the frontend layout. Selecting a later group alone may require its style import and the shared `ContourArt` component. The groups are separated for review; selective integration can retain just the chosen pieces.

## Implementation and verification

No new packages, CMS fields, migrations, or content updates are required. New artwork is inline SVG and inherits theme colors. The existing canvas ribbons now pause offscreen and in hidden tabs. The contours render only while settling after interaction. Both respond to reduced-motion preference changes without a reload, and the page remains readable without JavaScript.

Verification covers TypeScript, the existing five regression tests, a production build, responsive checks at 320 / 390 / 768 / 1440 pixels, keyboard navigation, the mobile menu, language switching, pointer and touch-scroll reactions, no-JavaScript rendering, and reduced motion in headless Chromium. Visual review includes the currently published photographs and alternative supplied portrait images.

Local preview used an isolated database with copies of public page content. Review this branch before choosing changes to merge into `develop` or `main`.
