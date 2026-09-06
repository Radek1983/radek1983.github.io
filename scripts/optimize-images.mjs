/**
 * Generuje warianty AVIF i WebP z zrodlowych plikow PNG.
 *
 * Specyfikacja rozdz. 10.1 wymaga AVIF/WebP oraz picture/srcset/sizes dla duzych fotografii
 * i zabrania wysylania obrazu 2500 px na telefon. Vite nie konwertuje formatow obrazow,
 * wiec robimy to jawnym krokiem przed buildem.
 *
 * Skrypt jest idempotentny: uruchomienie ponownie nadpisuje warianty. Jesli zrodlo zostanie
 * podmienione na wieksze, wystarczy `npm run images` i wszystkie szerokosci przeliczaja sie
 * od nowa.
 *
 * Warianty nigdy nie przekraczaja szerokosci zrodla - upscaling tylko powieksza plik,
 * nie dodaje szczegolu.
 */

import { readdir, stat, unlink } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
import sharp from 'sharp'

const IMAGES_ROOT = resolve(import.meta.dirname, '..', 'src', 'assets', 'images')

/** Szerokosci wariantow per proporcja. Wynikaja z pol, w ktorych obraz faktycznie stoi. */
const WIDTHS = {
  // Hero i sekcje full-bleed - pelna szerokosc viewportu.
  wide: [768, 1200, 1600, 2000],
  // Kadry pionowe 4:5 - polowa ekranu na desktopie, pelna na telefonie.
  portrait: [480, 768, 1120],
  // Kadry 3:2 - media sekcji.
  landscape: [768, 1200, 1600],
}

/** AVIF daje najmniejszy plik, WebP jest fallbackiem dla starszych Safari. */
const FORMATS = [
  { ext: 'avif', options: { quality: 55, effort: 6 } },
  { ext: 'webp', options: { quality: 78, effort: 5 } },
]

/** Formaty zrodlowe. PNG jest preferowany (bezstratny), JPG dopuszczalny. */
const SOURCE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg'])

/*
 * Kadry pochodne: art-directed wyciecie z istniejacego zrodla.
 *
 * Mechanizm zostaje, bo `object-position` nie zastapi swiadomego kadru, gdy
 * kontener ma skrajna proporcje. Lista jest dzis pusta: hero uzywa pelnego
 * kadru 16:9, w ktorym pusta sciana zajmuje lewa czesc obrazu na calej
 * wysokosci - dokladnie tam, gdzie lezy tekst.
 *
 * Format wpisu:
 *   { source: 'hero/plik.png', name: 'nazwa-kadru', top: 0.35, height: 0.39,
 *     widths: [1200, 1600] }
 * Wartosci `top` i `height` to udzial wysokosci zrodla, nie piksele, wiec
 * podmiana zdjecia na wieksze nie wymaga zmiany konfiguracji.
 */
const DERIVED_CROPS = []

function classify(width, height) {
  const ratio = width / height
  if (ratio < 1) return 'portrait'
  if (ratio > 1.7) return 'wide'
  return 'landscape'
}

/** hero-classroom-1600.png -> hero-classroom. Odcina koncowy numer z nazwy zrodla. */
function baseName(file) {
  return basename(file, extname(file)).replace(/-\d+$/, '')
}

async function collectSources(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await collectSources(path)))
    else if (entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
      out.push(path)
  }
  return out
}

const sources = (await collectSources(IMAGES_ROOT)).sort()

if (sources.length === 0) {
  console.error('Nie znaleziono zadnego pliku zrodlowego w src/assets/images/')
  process.exit(1)
}

let generated = 0
let removed = 0
let totalBytes = 0

for (const source of sources) {
  const image = sharp(source)
  const { width, height } = await image.metadata()
  const kind = classify(width, height)
  const base = baseName(source)
  const dir = resolve(source, '..')

  // Usun stare warianty tego obrazu - zrodlo moglo zmienic proporcje albo rozmiar.
  for (const entry of await readdir(dir)) {
    const ext = extname(entry).slice(1).toLowerCase()
    if (!FORMATS.some((f) => f.ext === ext)) continue
    if (!entry.startsWith(`${base}-`)) continue
    await unlink(join(dir, entry))
    removed += 1
  }

  const widths = WIDTHS[kind].filter((w) => w <= width)
  // Dodaj natywna szerokosc tylko wtedy, gdy wnosi realny zysk. Bez tego progu
  // zrodlo 1122 px obok wariantu 1120 px dawalo dwa niemal identyczne pliki.
  const largest = widths.length > 0 ? Math.max(...widths) : 0
  if (width > largest * 1.1) widths.push(width)

  const targets = []
  for (const w of widths) {
    for (const { ext, options } of FORMATS) {
      const out = join(dir, `${base}-${w}.${ext}`)
      targets.push(
        sharp(source)
          .resize({ width: w, withoutEnlargement: true })
          .toFormat(ext, options)
          .toFile(out)
          .then(async () => {
            const { size } = await stat(out)
            totalBytes += size
            generated += 1
            return { out, size, w, ext }
          }),
      )
    }
  }

  const results = await Promise.all(targets)
  const label = `${base} (${width}x${height}, ${kind})`
  const sizes = results
    .sort((a, b) => a.w - b.w || a.ext.localeCompare(b.ext))
    .map((r) => `${r.w}.${r.ext} ${(r.size / 1024).toFixed(0)}kB`)
    .join('  ')
  console.log(`${label}\n  ${sizes}`)
}

// --- Kadry pochodne ---
for (const crop of DERIVED_CROPS) {
  const source = resolve(IMAGES_ROOT, crop.source)
  const dir = resolve(source, '..')
  const meta = await sharp(source).metadata()

  const top = Math.round(meta.height * crop.top)
  const height = Math.min(Math.round(meta.height * crop.height), meta.height - top)

  for (const entry of await readdir(dir)) {
    const ext = extname(entry).slice(1).toLowerCase()
    if (!FORMATS.some((f) => f.ext === ext)) continue
    if (!entry.startsWith(`${crop.name}-`)) continue
    await unlink(join(dir, entry))
    removed += 1
  }

  const sizes = []
  for (const w of crop.widths.filter((width) => width <= meta.width)) {
    for (const { ext, options } of FORMATS) {
      const out = join(dir, `${crop.name}-${w}.${ext}`)
      await sharp(source)
        .extract({ left: 0, top, width: meta.width, height })
        .resize({ width: w, withoutEnlargement: true })
        .toFormat(ext, options)
        .toFile(out)

      const { size } = await stat(out)
      totalBytes += size
      generated += 1
      sizes.push(`${w}.${ext} ${(size / 1024).toFixed(0)}kB`)
    }
  }

  const ratio = (meta.width / height).toFixed(2)
  console.log(`${crop.name} (kadr pochodny ${meta.width}x${height}, proporcja ${ratio})`)
  console.log(`  ${sizes.join('  ')}`)
}

console.log(
  `\nUsunieto starych wariantow: ${removed}. Wygenerowano: ${generated}. ` +
    `Razem: ${(totalBytes / 1024 / 1024).toFixed(2)} MB.`,
)
