#!/usr/bin/env python3
"""Derive every web copy of the listing photography from the originals.

LOCAL AUTHORING TOOL. Netlify never runs this — the site itself still has no
build step and no dependencies. This is what you run once, on your machine or
in a session, when the photographer delivers.

    pip install Pillow
    python3 tools/photos.py --map tools/photo-map.txt

It reads a mapping of source file -> slug, and for each one writes:

    public/assets/img/gallery/<slug>.jpg     1800w  q82 progressive
    public/assets/img/gallery/<slug>.webp    1800w  q82
    public/assets/img/gallery/<slug>-t.jpg    800w  q82 progressive
    public/assets/img/gallery/<slug>-t.webp   800w  q82

With --hero SOURCE it also writes hero-md/lg/xl (900/1400/2048w, both formats)
and the 1200x630 social card at public/assets/img/og-card.jpg.

Rules it enforces so the gallery cannot go out of sync with the page:
  * Slugs must match the PHOTOS array in public/assets/js/main.js exactly —
    an unknown slug, or a slug with no source, is an error, not a warning.
    A listing page that silently drops a photo is worse than a failed run.
  * EXIF orientation is applied and then stripped, so a portrait frame is
    never served sideways and no camera metadata ships.
  * Images are never upscaled. A source narrower than the target keeps its
    own width, and the run reports it so you can ask for a better file.
"""
import argparse, hashlib, re, sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
GALLERY = ROOT / 'public/assets/img/gallery'
HERO = ROOT / 'public/assets/img/hero'
MAIN_JS = ROOT / 'public/assets/js/main.js'

FULL_W, THUMB_W = 1800, 800
HERO_W = {'md': 900, 'lg': 1400, 'xl': 2048}
QUALITY = 82
OG_SIZE = (1200, 630)


def slugs_from_main_js():
    src = MAIN_JS.read_text()
    block = src[src.index('var PHOTOS = ['):]
    block = block[:block.index('\n  ];')]
    return [m.group(1) for m in re.finditer(r"\['([^']+)'", block)]


def load(path):
    im = ImageOps.exif_transpose(Image.open(path))
    return im.convert('RGB')


def resize(im, width):
    if im.width <= width:
        return im, True
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.LANCZOS), False


def write(im, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix == '.jpg':
        im.save(path, 'JPEG', quality=QUALITY, progressive=True, optimize=True)
    else:
        im.save(path, 'WEBP', quality=QUALITY, method=6)


def emit(im, stem, width, outdir):
    out, small = resize(im, width)
    for ext in ('.jpg', '.webp'):
        write(out, outdir / (stem + ext))
    return out.width, small


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--map', required=True,
                    help='lines of "source/file.jpg  slug", # comments allowed')
    ap.add_argument('--hero', help='source image for the hero and social card')
    ap.add_argument('--allow-missing', action='store_true',
                    help='permit slugs with no source (they keep placeholders)')
    args = ap.parse_args()

    want = slugs_from_main_js()
    pairs, seen = [], set()
    for raw in Path(args.map).read_text().splitlines():
        line = raw.split('#', 1)[0].strip()
        if not line:
            continue
        src, slug = line.rsplit(None, 1)
        if slug not in want:
            sys.exit(f'slug "{slug}" is not in the PHOTOS array in main.js')
        if slug in seen:
            sys.exit(f'slug "{slug}" is mapped twice')
        p = (ROOT / src) if not Path(src).is_absolute() else Path(src)
        if not p.exists():
            sys.exit(f'source not found: {p}')
        seen.add(slug)
        pairs.append((p, slug))

    missing = [s for s in want if s not in seen]
    if missing and not args.allow_missing:
        sys.exit('no source mapped for: ' + ', '.join(missing) +
                 '\n(pass --allow-missing to build the rest anyway)')

    upscaled = []
    for src, slug in pairs:
        im = load(src)
        w_full, small_full = emit(im, slug, FULL_W, GALLERY)
        emit(im, slug + '-t', THUMB_W, GALLERY)
        if small_full:
            upscaled.append(f'{slug}: source only {im.width}px wide')
        print(f'  {slug:<22} {im.width}x{im.height} -> {w_full}w + {THUMB_W}w')

    if args.hero:
        him = load(args.hero)
        # Only emit a hero width the source can actually fill. Writing
        # hero-xl at 1024px and then describing it as 2048w in the srcset
        # makes the browser download a file that cannot deliver what the
        # descriptor promises.
        hero_written, seen_w = [], set()
        for name, w in HERO_W.items():
            eff = min(w, him.width)          # never upscale, never waste source
            if eff in seen_w:
                upscaled.append(f'hero-{name} skipped: source is only {him.width}px wide')
                continue
            actual, _ = emit(him, f'hero-{name}', eff, HERO)
            seen_w.add(actual)
            hero_written.append((name, actual))
        print('  hero widths written: ' +
              ', '.join(f'{n}={w}w' for n, w in hero_written))
        print('  -> the hero srcset in index.html must list exactly these widths')
        card = ImageOps.fit(him, OG_SIZE, Image.LANCZOS, centering=(0.5, 0.45))
        write(card, ROOT / 'public/assets/img/og-card.jpg')
        print(f'  hero + og-card         {him.width}x{him.height}')

    # A replaced photo keeps its filename, so a returning visitor's cache can
    # serve the OLD image from the new URL — the classic "why is that photo
    # still the wrong one" bug. Gallery URLs are built in JS, out of reach of
    # tools/stamp-assets.mjs, so they carry a version query instead.
    digest = hashlib.sha256()
    for f in sorted(GALLERY.glob('*')) + sorted(HERO.glob('*')):
        digest.update(f.name.encode())
        digest.update(f.read_bytes())
    version = digest.hexdigest()[:8]
    print(f'\n  photo version: {version}')
    print(f"  -> set PHOTO_V = '{version}' in public/assets/js/main.js")

    print(f'\n{len(pairs)} photo(s) written to {GALLERY.relative_to(ROOT)}')
    for note in upscaled:
        print('  ! ' + note)
    if missing:
        print('  ! still on placeholders: ' + ', '.join(missing))
    else:
        print('  all slots filled — set PHOTOS_PENDING = false in main.js, '
              'restore the <picture> markup and hero preload in index.html, '
              'and remove the placeholder note under the Gallery heading.')


if __name__ == '__main__':
    main()
