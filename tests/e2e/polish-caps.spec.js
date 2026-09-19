import { expect, test } from '@playwright/test'

/**
 * Polskie znaki w wersalikach.
 *
 * Krój display ma w wersalikach wyraźnie wyższy tusz, niż sugeruje wysokość
 * wielkiej litery. Zmierzone w Inter Display ExtraBold (canvas TextMetrics):
 *
 *   wersalik bez diakrytyków   0.73 em nad linią bazową
 *   wersalik z akcentem        0.95 em nad linią bazową   (Ó Ś Ć Ń Ź)
 *   ogonek                     0.21 em pod linią bazową   (Ą Ę)
 *
 * Stąd dwa niezależne wymagania, po jednym na defekt, który już wystąpił:
 *
 *   1. Interlinia >= 1.16 em (0.95 + 0.21), żeby ogonek wiersza N nie wszedł
 *      w akcent wiersza N+1. Przy 0.86 em brakowało 0.30 em i w "WIĘCEJ /
 *      CIĄGŁOŚCI" ogonek leżał na akcentach wiersza niżej.
 *
 *   2. Zapas w pudełku dla elementów odsłanianych maską. Maska ma rozmiar
 *      dokładnie pudełka obramowania, więc tusz wystający ponad nie zostaje
 *      ścięty płasko - dokładnie w miejscu kreski nad Ó.
 */

const INK_ASC = 0.95
const INK_DESC = 0.21
const MIN_LEADING = INK_ASC + INK_DESC

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
]

/* Zbiera wszystkie napisy wersalikami w stopniu, w którym akcent jest widoczny. */
const zbierz = (page) =>
  page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el)
      if (s.textTransform !== 'uppercase') continue

      const fs = parseFloat(s.fontSize)
      if (fs < 22) continue
      if (!el.textContent.trim()) continue

      const lh = parseFloat(s.lineHeight) / fs
      out.push({
        klasa: (el.className || el.tagName).toString().slice(0, 48),
        lh,
        linie: Math.round(el.getBoundingClientRect().height / (lh * fs)),
        padEm: parseFloat(s.paddingBlockStart) / fs,
        maska: el.hasAttribute('data-animation'),
      })
    }
    return out
  })

test.describe('polskie wersaliki', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'pomiar typografii raz wystarczy')
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('każdy wielowierszowy napis ma interlinię na akcent i ogonek', async ({ page }) => {
    const winni = []

    for (const url of STRONY) {
      await page.goto(url)
      await page.evaluate(() => document.fonts.ready)

      for (const el of await zbierz(page)) {
        if (el.linie > 1 && el.lh < MIN_LEADING - 0.001) {
          winni.push(`${url} ${el.klasa} lh=${el.lh.toFixed(2)} (min ${MIN_LEADING})`)
        }
      }
    }

    expect(winni).toEqual([])
  })

  /*
   * Element z data-animation dostaje w warstwie reveal maskę o rozmiarze
   * pudełka. Bez zapasu maska ścina akcent - i to nie zależy od tego, czy
   * animacja akurat trwa: stan końcowy też ma maskę.
   */
  test('każdy odsłaniany napis ma w pudełku miejsce na akcent', async ({ page }) => {
    const winni = []

    for (const url of STRONY) {
      await page.goto(url)
      await page.evaluate(() => document.fonts.ready)

      for (const el of await zbierz(page)) {
        if (!el.maska) continue

        /*
         * Tusz mieści się, gdy połowa interlinii plus padding pokrywa
         * różnicę między wznoszeniem kroju a wznoszeniem tuszu.
         * Wznoszenie i schodzenie kroju: 0.97 + 0.24 em.
         */
        const zapas = (el.lh - 1.21) / 2 + 0.97 - INK_ASC + el.padEm
        if (zapas < -0.001) {
          winni.push(`${url} ${el.klasa} brakuje ${Math.abs(zapas).toFixed(3)} em`)
        }
      }
    }

    expect(winni).toEqual([])
  })

  /*
   * Pas typograficzny ma `overflow` wyłącznie w poziomie - jako
   * zabezpieczenie przed scrollem w bok. Przywrócenie pełnego `clip`
   * ścinało w "MÓWIĘ" kreskę nad O i ogonek E.
   */
  test('pas typograficzny nie przycina w pionie', async ({ page }) => {
    await page.goto('/')

    const osie = await page
      .locator('.marquee')
      .evaluate((el) => [getComputedStyle(el).overflowX, getComputedStyle(el).overflowY])

    expect(osie[0]).toBe('clip')
    expect(osie[1]).toBe('visible')
  })
})
