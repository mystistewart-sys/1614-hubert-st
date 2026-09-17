# Original assets — do not edit, do not deploy

This directory sits outside `public/`, so it is never served. It holds the
unmodified originals the web copies are derived from.

## Photography — not yet supplied

No listing photography has been delivered for 1614 Hubert Street. Until it is,
the site ships labelled placeholder frames from
`public/assets/img/gallery/placeholder/` and `public/assets/img/hero/`.

When the photographs arrive:

1. Drop the untouched originals into `photos-original/`.
2. Derive the web copies into `public/assets/img/gallery/` as
   `<slug>.jpg` / `<slug>.webp` (1800w) and `<slug>-t.jpg` / `<slug>-t.webp`
   (800w), using the slugs in the `PHOTOS` array in
   `public/assets/js/main.js`, and the hero into
   `public/assets/img/hero/` as `hero-md`, `hero-lg`, `hero-xl` (900 / 1400 /
   2048w, WebP and JPEG).
3. Set `PHOTOS_PENDING = false` in `public/assets/js/main.js`, restore the
   `<picture>` block and the hero preload link in `public/index.html`, and
   delete the placeholder note under the Gallery heading.
4. Add the 1200 × 630 social card at `public/assets/img/og-card.jpg` and
   restore the `og:image` / `twitter:image` tags, switching the Twitter card
   back to `summary_large_image`.

## Brand and agent artwork

`mysti-stewart-original.jpg` is the unmodified agent headshot as supplied
(2000 × 2000 JPEG). The web copies in `public/assets/img/agent/` are a 4:5 crop
derived from it at 560w and 900w, WebP and JPEG. `logo-original.jpg` and
`logo-transparent.png` are the Mysti Stewart Group lockup; the parallelogram
mark is inlined as SVG in the page and in `favicon.svg`.

## Also not supplied by the client

Floor plan, video, virtual tour, renovation cost schedule, solar documentation,
short-term rental permit and history, comparables, survey, seller's disclosure,
itemised tax bill and appraisal district detail.
