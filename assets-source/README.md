# Original assets — do not edit, do not deploy

This directory sits outside `public/`, so it is never served. It holds the
unmodified originals every web copy is derived from.

## Photography

`photos-original/` holds `1.jpg`–`15.jpg`, the set delivered 2026-09-22, plus
six earlier camera originals (`DSC*.jpg`). All 15 of the delivered set are in
use. `tools/photo-map.txt` records which source became which slug:

```bash
pip install Pillow
python3 tools/photos.py --map tools/photo-map.txt \
        --hero assets-source/photos-original/1.jpg
```

### The resolution ceiling

Every file in the delivered set is **1024px or smaller** — several are under
800px. The layout can use 1800px, so nothing serves at full quality, and
`tools/photos.py` lists each shortfall at the end of every run.

It bites hardest on the hero, which runs full-bleed across the viewport. From
a 1024px source only two hero widths exist (900w and 1024w) rather than the
usual three, and the srcset in `index.html` says so — claiming a 2048w file
that is really 1024px would make the browser download a file that cannot
deliver what the descriptor promises.

The six `DSC*.jpg` originals are 4000–6000px and cover the front elevation, a
desk-nook view and the bath. They are kept for exactly this reason: if a
full-resolution hero matters more than the tighter framing of `1.jpg`,
`DSC02278.jpg` is the same view at 5922px.

**Worth requesting:** the delivered set at full resolution. Re-run the tool
after dropping the files in and updating `tools/photo-map.txt`; nothing else
changes.

## Brand and agent artwork

`mysti-stewart-original.jpg` is the unmodified agent headshot as supplied
(2000 × 2000 JPEG). The web copies in `public/assets/img/agent/` are a 4:5 crop
derived from it at 560w and 900w, WebP and JPEG. `logo-original.jpg` and
`logo-transparent.png` are the Mysti Stewart Group lockup; the parallelogram
mark is inlined as SVG in the page and in `favicon.svg`.

## Still not supplied

Floor plan, video, virtual tour, renovation cost schedule, solar documentation,
short-term rental permit and history, comparables, survey, seller's disclosure.
