import { expect, test } from '@playwright/test'

/**
 * Akty 09-12: rytm kolorystyczny i plakatowa typografia.
 *
 * Sekcje lokalizacji, seniorów i FAQ czytały się jak zwykłe moduły
 * informacyjne obok plakatowej reszty strony. Przebudowa dotyczyła
 * hierarchii i koloru; treść merytoryczna została bez zmian.
 */

const PAPER = 'rgb(242, 239, 232)'
const INK = 'rgb(10, 10, 10)'
const BLUE = 'rgb(18, 59, 140)'
const SIGNAL = 'rgb(242, 59, 47)'

const WIDOKI = [
  [1920, 1080],
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
]

test.describe('akty 09-12', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
  })

  /*
   * Regula "kolor zmienia akt" z par. 9. Cztery sekcje pod rzad musza isc
   * neutralny -> kolor -> ciemny -> neutralny, inaczej strona wraca do tej
   * samej stylistyki co jej poczatek.
   */
  test('rytm kolorów idzie kremowy, granat, czerń, kremowy', async ({ page }) => {
    const tla = await page.evaluate(() =>
      ['#lokalizacja', '#seniorzy', '#faq', '#kontakt'].map(
        (s) => getComputedStyle(document.querySelector(s)).backgroundColor,
      ),
    )

    expect(tla).toEqual([PAPER, BLUE, INK, PAPER])
  })

  test('09 SP 402 ma nagłówek plakatowy i kadr przy krawędzi', async ({ page }) => {
    const tytul = page.locator('#lokalizacja-title')
    // <br /> bez spacji wokol daje 'SP 402Po lekcjach.' w textContent.
    await expect(tytul).toContainText('SP 402')
    await expect(tytul).toContainText('Po lekcjach.')
    await expect(tytul).toHaveCSS('text-transform', 'uppercase')

    const m = await page.evaluate(() => {
      const el = document.querySelector('#lokalizacja-title')
      const cs = getComputedStyle(el)
      const media = document.querySelector('.location__media').getBoundingClientRect()
      return {
        stopien: Math.round(parseFloat(cs.fontSize)),
        linie: Math.round(el.getBoundingClientRect().height / parseFloat(cs.lineHeight)),
        nadmiar: el.scrollWidth - el.clientWidth,
        odPrawej: Math.round(window.innerWidth - media.right),
        udzialKadru: Math.round((media.width / window.innerWidth) * 100),
      }
    })

    expect(m.linie, 'dwa wiersze').toBe(2)
    expect(m.nadmiar, 'clipping naglowka').toBeLessThanOrEqual(1)
    expect(m.stopien, 'rejestr plakatowy').toBeGreaterThanOrEqual(64)
    expect(m.odPrawej, 'kadr przy krawedzi okna').toBeLessThanOrEqual(1)
    expect(m.udzialKadru).toBeGreaterThanOrEqual(50)

    // Zastrzezenie zostaje, ale wyciszone i pod kreska.
    const przypis = page.locator('.location__disclaimer')
    await expect(przypis).toContainText('nie jest oficjalnym serwisem')
    await expect(przypis).not.toHaveCSS('border-top-width', '0px')
  })

  /*
   * Sekcja przeszla 16.09.2026 z jednej grupy poczatkujacej na TRZY rownorzedne
   * poziomy - zlecil to wlasciciel wraz z obrazem referencyjnym. Tutaj pilnujemy
   * tego, co sekcja ma jako AKT: plakatowy naglowek, numerowana sekwencja,
   * kremowa kapsula i zero kart. Geometrie i brzmienie poziomow trzyma
   * osobny zamek w tests/e2e/seniorzy.spec.js (CLAUDE.md §15, D16).
   */
  test('10 seniorzy: nagłówek wersalikami i trzy numerowane poziomy', async ({ page }) => {
    const tytul = page.locator('#seniorzy-title')
    await expect(tytul).toHaveCSS('text-transform', 'uppercase')
    await expect(tytul).toHaveText('Angielski dla seniorów.')

    const poziomy = page.locator('.seniors__level')
    await expect(poziomy).toHaveCount(3)
    for (const [i, [numer, nazwa]] of [
      ['01', 'Początkująca'],
      ['02', 'Podstawowa'],
      ['03', 'Średniozaawansowana'],
    ].entries()) {
      await expect(poziomy.nth(i).locator('.seniors__level-number')).toHaveText(numer)
      await expect(poziomy.nth(i).locator('.seniors__level-name')).toHaveText(nazwa)
      await expect(poziomy.nth(i).locator('.seniors__level-name')).toHaveCSS(
        'text-transform',
        'uppercase',
      )
    }

    // Lista jest numerowana semantycznie, nie tylko wizualnie.
    await expect(page.locator('ol.seniors__levels')).toHaveCount(1)

    /*
     * Kapsula pelna, ale NIE czerwona: czerwien niesie glowna konwersje
     * dla rodzicow, a ta sekcja celuje w innego odbiorce i stoi poza lejkiem.
     */
    const cta = page.locator('#seniorzy .cta')
    await expect(cta).toHaveCSS('background-color', PAPER)
    await expect(cta).not.toHaveCSS('background-color', SIGNAL)
    await expect(cta).toHaveAttribute('href', '/oferta/seniorzy/')

    // Zero kart: brak zaokraglen i cieni na modulach sekcji.
    const ozdoby = await page.evaluate(
      () =>
        [...document.querySelectorAll('#seniorzy .seniors__level, #seniorzy .media')].filter(
          (el) => {
            const cs = getComputedStyle(el)
            return parseFloat(cs.borderRadius) > 0 || cs.boxShadow !== 'none'
          },
        ).length,
    )
    expect(ozdoby).toBe(0)
  })

  test('11 FAQ działa i jest czytelne na czerni', async ({ page }) => {
    const k = await page.evaluate(() => {
      const cs = (s, p) => getComputedStyle(document.querySelector(s))[p]
      return {
        tlo: cs('#faq', 'backgroundColor'),
        tytul: cs('.faq__title', 'color'),
        pytanie: cs('.faq__question', 'color'),
        odpowiedz: cs('.faq__answer', 'color'),
      }
    })

    expect(k.tlo).toBe(INK)
    expect(k.tytul).toBe(PAPER)
    expect(k.pytanie).toBe(PAPER)
    expect(k.odpowiedz, 'odpowiedz nie znika w tle').not.toBe(k.tlo)

    // Mechanika bez zmian: kazde pytanie otwiera sie i domyka.
    const pytania = page.locator('.faq__item')
    await expect(pytania).toHaveCount(5)

    for (let i = 0; i < 5; i += 1) {
      const item = pytania.nth(i)
      await item.locator('summary').click()
      await expect(item).toHaveAttribute('open', '')
      await expect(item.locator('.faq__answer')).toBeVisible()
      await item.locator('summary').click()
      await expect(item).not.toHaveAttribute('open', '')
    }
  })

  /*
   * Czerwien jest akcentem interakcji, nie dekoracja: dotyka znaku plus,
   * a nie samego pytania ani kreski pod kazdym wierszem.
   */
  test('FAQ: czerwień pojawia się przy wskazaniu i otwarciu', async ({ page }) => {
    const znak = page.locator('.faq__item').first().locator('.faq__sign')

    await page.locator('.faq__question').first().hover()
    await expect(znak).toHaveCSS('color', SIGNAL)

    await page.locator('.faq__question').first().click()
    await expect(znak).toHaveCSS('color', SIGNAL)

    // Naglowek zostaje kremowy - zadnego czerwonego naglowka.
    await expect(page.locator('.faq__title')).not.toHaveCSS('color', SIGNAL)
  })

  test('cel dotykowy pytania ma minimum 44 px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const wysokosci = await page.evaluate(() =>
      [...document.querySelectorAll('.faq__question')].map((el) =>
        Math.round(el.getBoundingClientRect().height),
      ),
    )
    for (const h of wysokosci) expect(h).toBeGreaterThanOrEqual(44)
  })

  for (const [width, height] of WIDOKI) {
    test(`trzy akty bez przepełnienia przy ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      const w = await page.evaluate(() => {
        const nadmiar = (s) => {
          const el = document.querySelector(s)
          return el.scrollWidth - el.clientWidth
        }
        return {
          strona: document.documentElement.scrollWidth - window.innerWidth,
          sp402: nadmiar('#lokalizacja-title'),
          seniorzy: nadmiar('#seniorzy-title'),
          faq: nadmiar('.faq__title'),
        }
      })

      expect(w.strona, 'poziomy scroll').toBeLessThanOrEqual(0)
      expect(w.sp402, 'naglowek SP 402').toBeLessThanOrEqual(1)
      expect(w.seniorzy, 'naglowek seniorow').toBeLessThanOrEqual(1)
      expect(w.faq, 'naglowek FAQ').toBeLessThanOrEqual(1)
    })
  }
})
