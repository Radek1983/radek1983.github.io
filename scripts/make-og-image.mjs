/**
 * Generuje GLOBALNA grafike Open Graph (1200 x 630) z szablonu
 * `scripts/og-image.html`.
 *
 * DLACZEGO PRZEGLADARKA, A NIE EDYTOR GRAFICZNY
 *
 * Obrazek niesie wordmark i haslo w kroju Inter Display, w kolorach marki.
 * Skladany osobno w edytorze rozjezdzalby sie ze strona przy kazdej zmianie
 * copy albo stopnia pisma. Tutaj render idzie przez Chromium z Playwrighta,
 * ktorego repozytorium i tak uzywa do testow, i bierze TE SAME pliki WOFF2,
 * ktore serwuje strona. Zero nowych zaleznosci.
 *
 * Skrypt jest jawnym krokiem, tak jak `npm run images`: nie uruchamia sie
 * przy buildzie, bo wynik to zasob statyczny, ktory zmienia sie rzadko.
 *
 * JEDEN OBRAZ DLA CALEGO SERWISU. Wszystkie dziewiec stron wskazuje ten sam
 * plik - decyzja wlasciciela z 19.09.2026. Parametry sluza do poprawek
 * tresci, nie do robienia wariantow per podstrona.
 *
 * Uzycie:
 *   node scripts/make-og-image.mjs
 *   node scripts/make-og-image.mjs --haslo1 "Wiecej swobody" --haslo2 "W angielskim."
 */

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { chromium } from '@playwright/test'

const KATALOG = resolve(import.meta.dirname, '..')
const SZABLON = resolve(KATALOG, 'scripts', 'og-image.html')
const WYJSCIE = resolve(KATALOG, 'public', 'social')

/* Wymiar wymagany przez Facebooka, LinkedIn i Twittera - 1.91:1. */
const SZEROKOSC = 1200
const WYSOKOSC = 630

/**
 * Teksty z projektu wlasciciela.
 *
 * Nazwy odbiorcow stoja MALA LITERA - to wyliczenie, nie nazwy wlasne.
 * Adres ma forme z `www`, zeby w miniaturze czytal sie jednoznacznie
 * jak adres internetowy, a nie jak nazwa firmy.
 */
const DOMYSLNE = {
  haslo1: 'Więcej swobody',
  haslo2: 'W angielskim.',
  oferta: 'dzieci|ósmoklasiści|seniorzy|online 1 na 1',
  wordmark: 'High Five',
  www: 'www.highfive.academy',
  plik: 'og-image',
}

function parametry(argv) {
  const out = { ...DOMYSLNE }
  for (let i = 0; i < argv.length; i += 2) {
    const klucz = argv[i]?.replace(/^--/, '')
    const wartosc = argv[i + 1]
    if (klucz in out && wartosc) out[klucz] = wartosc
  }
  return out
}

const { haslo1, haslo2, oferta, wordmark, www, plik } = parametry(process.argv.slice(2))

const czcionka = (nazwa) => pathToFileURL(resolve(KATALOG, 'src', 'assets', 'fonts', nazwa)).href

/*
 * Wiersz oferty sklejany tutaj, a nie w szablonie: separatory sa czerwone
 * i musza byc osobnymi elementami, a lista pozycji ma zostac parametrem.
 * `aria-hidden` jest formalnoscia - to grafika, ale znacznik i tak mowi,
 * ze kropka nie jest trescia.
 */
const wierszOferty = oferta
  .split('|')
  .map((p) => `<span class="oferta__pozycja">${p.trim()}</span>`)
  .join('<span class="oferta__kropka" aria-hidden="true">•</span>')

const html = (await readFile(SZABLON, 'utf8'))
  .replace('__FONT_DISPLAY__', czcionka('InterDisplay-ExtraBold.woff2'))
  .replace('__FONT_TEXT__', czcionka('Inter-Medium.woff2'))
  .replace('__HASLO_1__', haslo1)
  .replace('__HASLO_2__', haslo2)
  .replace('__OFERTA__', wierszOferty)
  .replace('__WORDMARK__', wordmark)
  .replace('__WWW__', www)

/*
 * Szablon ladowany jest z pliku w katalogu `scripts/`, a nie z `data:`:
 * przy `data:` przegladarka traktuje dokument jako pochodzacy z unikalnego,
 * pustego zrodla i odmawia wczytania czcionek z `file://`.
 */
const tymczasowy = resolve(KATALOG, 'scripts', '.og-image.tmp.html')
await writeFile(tymczasowy, html, 'utf8')

await mkdir(WYJSCIE, { recursive: true })

const przegladarka = await chromium.launch()

try {
  const strona = await przegladarka.newPage({
    viewport: { width: SZEROKOSC, height: WYSOKOSC },

    /* Bez tego render jest wykonany w skali ekranu, a plik wychodzi rozmyty
       na ekranach o wysokiej gestosci pikseli. */
    deviceScaleFactor: 1,
  })

  await strona.goto(pathToFileURL(tymczasowy).href)

  /*
   * Czekamy na kroje. Wyrazenie jest STRINGIEM, nie funkcja strzalkowa:
   * `document` nie istnieje w Node, wiec funkcja odpalalaby regule `no-undef`
   * w lincie, choc wykonuje sie w przegladarce. String Playwright wykonuje
   * po swojej stronie i lint nie ma czego sprawdzac.
   */
  await strona.evaluate('document.fonts.ready')

  /*
   * PNG, nie JPG. Grafika jest plaska i typograficzna: PNG trzyma ostre
   * krawedzie liter bez artefaktow kompresji, a przy dwoch kolorach tla
   * wazy tyle samo albo mniej niz JPG tej samej jakosci.
   */
  const cel = resolve(WYJSCIE, `${basename(plik, '.png')}.png`)
  await strona.screenshot({ path: cel, type: 'png' })

  /* Kontrola: wymiary czytane z gotowego pliku, nie z konfiguracji. */
  const miara = await strona.evaluate('[innerWidth, innerHeight]')
  console.log(`${cel.replace(KATALOG, '.')} — ${miara[0]}x${miara[1]}`)
} finally {
  await przegladarka.close()

  /* Plik roboczy nie zostaje w repozytorium - istnieje tylko na czas renderu. */
  await rm(tymczasowy, { force: true })
}
