import { expect, test } from '@playwright/test'

/**
 * Higiena językowa tekstów.
 *
 * Audyt całego serwisu wyłapał cztery usterki, których nie widać w kodzie,
 * a widać je na stronie. Testy niżej pilnują ich osobno, bo każda wraca
 * inną drogą: przez copy-paste, przez edytor podmieniający znaki albo
 * przez dopisanie nowego akapitu obok istniejącego.
 */

const STRONY = [
  '/',
  '/oferta/',
  '/oferta/dzieci/',
  '/oferta/egzamin-osmoklasisty/',
  '/oferta/seniorzy/',
  '/oferta/online/',
  '/cennik/',
  '/lokalizacje/',
  '/kariera/',
  '/404.html',
]

/* Cały widoczny tekst strony: nagłówek, treść, stopka, alt i aria. */
const tekst = (page) =>
  page.evaluate(() => {
    for (const d of document.querySelectorAll('details')) d.open = true
    const opisy = [...document.querySelectorAll('[alt],[aria-label],[title]')]
      .flatMap((el) => [
        el.getAttribute('alt'),
        el.getAttribute('aria-label'),
        el.getAttribute('title'),
      ])
      .filter(Boolean)
    return [document.body.innerText, ...opisy].join('\n')
  })

test.describe('higiena językowa', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'tekst jest ten sam w każdym silniku')
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  /*
   * Uszkodzone kodowanie potrafi wejść przez wklejenie tekstu z pliku
   * zapisanego w innej stronie kodowej. Efekt to "zajÄ™cia" zamiast "zajęcia" -
   * czytelne dopiero w przeglądarce, nie w diffie.
   */
  test('nigdzie nie ma uszkodzonego kodowania', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const t = await tekst(page)
      expect(t, `mojibake na ${url}`).not.toMatch(/Ã.|Å.|â€|ï»¿|�/)
    }
  })

  /*
   * Serwis pisze wtrącenia myślnikiem (—). Półpauza (–) wchodziła przez
   * autokorektę edytora i to samo zdanie na dwóch stronach miało dwa różne
   * znaki. Konsekwencja jest tu tańsza niż dyskusja o typografii.
   */
  test('wtrącenia zapisujemy jednym znakiem', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const t = await tekst(page)
      expect(t, `półpauza zamiast myślnika na ${url}`).not.toMatch(/–/)
    }
  })

  test('brak podwójnych spacji i spacji przed interpunkcją', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const t = await tekst(page)

      for (const wiersz of t.split('\n')) {
        const l = wiersz.trim()
        if (!l) continue
        expect(l, `podwójna spacja na ${url}`).not.toMatch(/ {2,}/)
        expect(l, `spacja przed interpunkcją na ${url}`).not.toMatch(/\s[.,;:!?]/)
      }
    }
  })

  /*
   * Trzy konkretne błędy znalezione w audycie. Każdy jest krótki, więc
   * łatwo wraca przy kolejnym przepisywaniu akapitu.
   */
  test('poprawione błędy gramatyczne nie wracają', async ({ page }) => {
    await page.goto('/')
    const t = await tekst(page)

    // Rodzaj: "przygotowanie" jest nijakie, więc "osobne", nie "osobny".
    expect(t).not.toMatch(/osobny przygotowanie/)
    expect(t).toMatch(/osobne przygotowanie do egzaminu/)

    // Czasownik zwrotny: "przekłada SIĘ na".
    expect(t).toMatch(/przekłada się na High Five/)
    expect(t).not.toMatch(/doświadczenie przekłada na/)
  })

  /*
   * Osoba prowadząca ma jedno imię w całym serwisie. "Magda" na stronie
   * seniorów wyglądała jak inna osoba niż "Magdalena" na stronie głównej.
   */
  test('osoba prowadząca nazywa się wszędzie tak samo', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const t = await tekst(page)

      if (!/Germel/.test(t)) continue
      expect(t, `skrócone imię na ${url}`).not.toMatch(/\bMagda\b(?!lena)/)
      expect(t, `pełne imię na ${url}`).toMatch(/Magdalen[aęy] Germel/)
    }
  })
})
