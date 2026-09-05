# Experimental frontend

Branch: `experimental/frontend`, based on the `main` release at `c128c94`.

**Saved first version:** tag `checkpoint/frontend-v1`, pointing to `7a316e6`, is pushed to the remote. It preserves the complete first design pass, including the original arched portrait. The requested rectangular-portrait correction is separate at `c2708d7`.

The design uses the idea of finding a personal path: contours, small navigation drawings, and lines that meet. It keeps the site's existing palette, typefaces, CMS copy, and uploaded photography.

## What to try

- **Homepage:** the rectangular portrait, offset outline and paper note; the numbered empathy list; the framed story photograph. Move your pointer across the story section to gently reshape the contour drawing. On a phone, the drawing follows your scroll.
- **Ribbon study:** below the homepage empathy list, move the pointer across the drawing to gather the lines into a moving point. On phones, it follows the scroll; it settles at rest and pauses offscreen.
- **Mentoring cards:** hover or keyboard-focus a card. The paper surface becomes teal, each illustration makes its own small movement, and the arrow leads to the mentoring page.
- **Journal:** posts without cover photos get one of three original SVG cover studies, selected consistently from the post slug. Hover to move the drawing. Uploaded covers still take priority.
- **Inner pages:** contour artwork sits behind the existing hero ribbons. The mentoring journey connects its numbered steps horizontally on desktop and vertically on phones.
- **About page:** the existing personal statement becomes a larger pull quote with a drawn underline.
- **Footer:** the CMS brand name becomes a large typographic signature beside a botanical line drawing.
- **Closing invitations:** two contour fields respond around the text, and a small meeting-point illustration draws itself as the section enters view.

## How new Bilješke covers work

An uploaded cover photo always takes priority. If the cover is empty, the article slug automatically selects one of three built-in SVG illustrations. These are a fixed set, not newly generated images for each article, and multiple articles can share a design. The same slug keeps the same illustration; changing the slug may select another one. There is currently no illustration picker in the CMS.

## Review by change

| Commit | Design group |
| --- | --- |
| `7c79805` | Homepage composition, illustrated mentoring cards, interactive contour component |
| `4a89620` | Journal illustrations and cover interactions |
| `f63214b` | Inner-page contours, mentoring journey, closing invitations |
| `7a316e6` | Mobile scrolling, motion lifecycle, narrow-phone layout and document-language fixes |
| `c2708d7` | Requested rectangular hero-photo correction |
| Second creative pass | Ribbon study, individual glyph motion, About pull quote, signature footer; styling in `explorations.css` |

The first groups share `artistry.css`, imported by the frontend layout. The second creative pass adds `explorations.css`. Selecting a later group alone may require its style import and the shared `ContourArt` component. The groups are separated for review; selective integration can retain just the chosen pieces.

## Implementation and verification

No new packages, CMS fields, migrations, or content updates are required. New artwork is inline SVG and inherits theme colors. The existing canvas ribbons now pause offscreen and in hidden tabs. The contours render only while settling after interaction. Both respond to reduced-motion preference changes without a reload, and the page remains readable without JavaScript.

Verification covers TypeScript, the existing five regression tests, a production build, responsive checks at 320 / 390 / 768 / 1024 / 1440 pixels, keyboard navigation, the mobile menu, language switching, pointer and touch-scroll reactions, no-JavaScript rendering, and reduced motion in headless Chromium. Visual review includes the currently published photographs and alternative supplied portrait images.

Local preview used an isolated database with copies of public page content. Review this branch before choosing changes to merge into `develop` or `main`.
