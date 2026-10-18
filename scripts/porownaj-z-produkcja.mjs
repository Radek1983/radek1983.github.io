/* global document, window */
/*
 * POROWNANIE UKLADU: LOKALNIE vs PRODUKCJA
 *
 * Powstalo 11.10.2026, po tym jak kilka zmian z rzedu przesunelo uklad
 * w miejscach, ktorych nie dotyczyly wprost. Wzrokowe sprawdzanie zrzutow
 * tego nie wylapuje - przesuniecie o 20 px widac dopiero w pomiarze.
 *
 * Skrypt wchodzi na te same adresy lokalnie i na produkcji, mierzy geometrie
 * kazdej sekcji i kazdego kadru, a potem pokazuje WYLACZNIE roznice powyzej
 * tolerancji. Pusty raport znaczy: uklad jest tozsamy.
 *
 * Uzycie:
 *   node scripts/porownaj-z-produkcja.mjs            (1920x1080)
 *   node scripts/porownaj-z-produkcja.mjs 1440 900
 */

import { chromium } from '@playwright/test'

const LOKALNIE = process.env.LOKALNY_HOST ?? 'http://127.0.0.1:5173'
const PRODUKCJA = 'https://www.highfive.academy'

const SZEROKOSC = Number(process.argv[2] ?? 1920)
const WYSOKOSC = Number(process.argv[3] ?? 1080)

/* Tolerancja w pikselach. Ponizej tego roznice biora sie z zaokraglen. */
const TOLERANCJA = 3

const STRONY = [
  '/',
  '/oferta/',
  '/oferta/dzieci/',
  '/oferta/egzamin-osmoklasisty/',
  '/oferta/seniorzy/',
  '/oferta/online/',
  '/lokalizacje/',
  '/cennik/',
  '/kariera/',
  '/polityka-prywatnosci/',
]

/*
 * Pozycje liczone od POCZATKU DOKUMENTU, nie od okna - dzieki temu wynik
 * nie zalezy od tego, jak daleko skrypt przewinal strone przed odczytem.
 */
const zbierz = async (strona, adres) => {
  await strona.goto(adres, { waitUntil: 'networkidle', timeout: 45000 })
  await strona.evaluate(() => document.fonts.ready)

  /* Przewiniecie w dol i z powrotem - czesc sekcji ma animacje wejscia. */
  await strona.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await strona.waitForTimeout(1200)
  await strona.evaluate(() => window.scrollTo(0, 0))
  await strona.waitForTimeout(500)

  return strona.evaluate(() => {
    const opis = (el, i) => {
      const klasy = (el.className || '')
        .toString()
        .split(/\s+/)
        .filter((c) => c && !c.startsWith('is-') && !c.startsWith('u-'))
        .slice(0, 2)
        .join('.')
      return (
        (el.id ? '#' + el.id : el.tagName.toLowerCase()) +
        (klasy ? '.' + klasy : '') +
        '[' +
        i +
        ']'
      )
    }

    const wynik = {}
    const elementy = [
      ...document.querySelectorAll('section, figure, .media, .page-hero__text, .split__text'),
    ]

    elementy.forEach((el, i) => {
      const r = el.getBoundingClientRect()
      if (r.width < 40 || r.height < 20) return
      wynik[opis(el, i)] = {
        gora: Math.round(r.top + window.scrollY),
        lewa: Math.round(r.left),
        szer: Math.round(r.width),
        wys: Math.round(r.height),
      }
    })

    return wynik
  })
}

const przegladarka = await chromium.launch()
const strona = await przegladarka.newPage({ viewport: { width: SZEROKOSC, height: WYSOKOSC } })

console.log(`Porownanie ukladu przy ${SZEROKOSC} x ${WYSOKOSC}`)
console.log(`lokalnie:  ${LOKALNIE}`)
console.log(`produkcja: ${PRODUKCJA}`)
console.log(`tolerancja: ${TOLERANCJA} px`)
console.log('')

let wszystkieRoznice = 0

for (const sciezka of STRONY) {
  let lokalne
  let produkcyjne
  try {
    produkcyjne = await zbierz(strona, PRODUKCJA + sciezka)
    lokalne = await zbierz(strona, LOKALNIE + sciezka)
  } catch (blad) {
    console.log(`${sciezka}  BLAD: ${blad.message.split('\n')[0]}`)
    continue
  }

  const roznice = []
  const klucze = new Set([...Object.keys(produkcyjne), ...Object.keys(lokalne)])

  for (const klucz of klucze) {
    const p = produkcyjne[klucz]
    const l = lokalne[klucz]

    if (!p) {
      roznice.push(`  ${klucz}  TYLKO LOKALNIE`)
      continue
    }
    if (!l) {
      roznice.push(`  ${klucz}  BRAK LOKALNIE (jest na produkcji)`)
      continue
    }

    const zmiany = []
    for (const pole of ['gora', 'lewa', 'szer', 'wys']) {
      const delta = l[pole] - p[pole]
      if (Math.abs(delta) > TOLERANCJA) {
        zmiany.push(`${pole} ${p[pole]} -> ${l[pole]} (${delta > 0 ? '+' : ''}${delta})`)
      }
    }
    if (zmiany.length) roznice.push(`  ${klucz}  ${zmiany.join(', ')}`)
  }

  if (roznice.length) {
    console.log(`${sciezka}  — ${roznice.length} roznic`)
    roznice.sort().forEach((r) => console.log(r))
    console.log('')
    wszystkieRoznice += roznice.length
  } else {
    console.log(`${sciezka}  uklad tozsamy`)
  }
}

console.log('')
console.log(
  wszystkieRoznice === 0
    ? 'UKLAD TOZSAMY NA WSZYSTKICH STRONACH'
    : `roznic lacznie: ${wszystkieRoznice}`,
)

await przegladarka.close()
