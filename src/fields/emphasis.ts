// Editorial headlines mix roman / italic / bold within one line (her signature look).
// To keep CMS editing simple, editors use a light markup convention instead of HTML:
//   _riječ_   → italic accent (teal)
//   **riječ** → bold
// The frontend (see src/lib/emphasis.tsx) renders these into the serif headline.
export const emphasisDescription =
  'Enter = novi red; dva puta Enter = novi pasus. _kurziv_ = naglasak, **podebljano** = podebljan tekst.'
