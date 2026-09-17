# Original assets — do not edit, do not deploy

This directory sits outside `public/`, so it is never served. It holds the
unmodified originals every web copy is derived from.

## Photography

`photos-original/` holds the 20 files as delivered. Sixteen of them are in use;
`tools/photo-map.txt` records which source became which gallery slug, and
`tools/photos.py` regenerates every web copy from that map:

```bash
pip install Pillow
python3 tools/photos.py --map tools/photo-map.txt \
        --hero assets-source/photos-original/DSC02278.jpg
```

### Two quality tiers, and what to do about it

| Tier | Files | Size |
|---|---|---|
| Camera originals | `DSC02278`, `DSC02582`, `DSC02598`, `DSC02622`, `DSC02628`, `DSC02631` | 4000–6000px |
| MLS exports | the `d8a3f0bf…` files, `a0FPl…`, `living room photo*` | 1013–2048px |

The originals carry the front elevation (and the hero and social card), the
desk nook and the bath. Everything else — the whole kitchen, the bedroom and
three living-room views — comes from MLS exports that land below the 1800px
target, and several are PNGs re-encoded from JPEG, so they carry compression
artefacts before we touch them. `tools/photos.py` never upscales, so those
slots simply serve at their own width and are listed at the end of every run.

**Worth requesting from the photographer:** the originals for the kitchen,
bedroom and living-room frames. The kitchen is the strongest room in the house
and is currently the softest set on the page. Drop them into
`photos-original/`, update `tools/photo-map.txt`, re-run the tool.

Four delivered files are unused: a second bath vertical, a duplicate kitchen
wide, a bath-hall view and a living-room vertical. They are kept in case a
slot is re-cut.

## Brand and agent artwork

`mysti-stewart-original.jpg` is the unmodified agent headshot as supplied
(2000 × 2000 JPEG). The web copies in `public/assets/img/agent/` are a 4:5 crop
derived from it at 560w and 900w, WebP and JPEG. `logo-original.jpg` and
`logo-transparent.png` are the Mysti Stewart Group lockup; the parallelogram
mark is inlined as SVG in the page and in `favicon.svg`.

## Still not supplied

Floor plan, video, virtual tour, renovation cost schedule, solar documentation,
short-term rental permit and history, comparables, survey, seller's disclosure.
