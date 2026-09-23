import { devices, expect, test } from '@playwright/test'

/**
 * Numer telefonu: odnośnik na dotyku, zwykły tekst na wskaźniku.
 *
 * Decyzja właściciela z 23.09.2026 — zastępuje wcześniejszą, w której
 * numer w sekcji 12 stał jako tekst, a klikalny był tylko w stopce.
 * Nowa zasada obejmuje **wszystkie** numery w serwisie i rozstrzyga
 * o nich rodzaj urządzenia, a nie miejsce na stronie.
 *
 * Czego pilnujemy:
 *   1. na dotyku każdy numer jest odnośnikiem `tel:` — i to na każdej stronie,
 *   2. na wskaźniku żaden nie jest odnośnikiem ani nie łapie focusu,
 *   3. numer jest widoczny w obu trybach — zmienia się forma, nie treść,
 *   4. e-mail obok zostaje odnośnikiem zawsze, bo `mailto:` działa wszędzie.
 *
 * Zachowanie bez JavaScriptu sprawdza `regressions.spec.js`: tam numer
 * musi być klikalny wszędzie, bo skrypt nie zdążył zdjąć `href`.
 */

const NUMER = 'tel:+48790266517'
const WIDOCZNY = '+48 790 266 517'

/* Selektor łapie obie postacie: przed zdjęciem `href` i po nim. */
const SELEKTOR = 'a[href^="tel:"], a[data-tel-href]'

const STRONY = [
  '/',
  '/oferta/dzieci/',
  '/oferta/egzamin-osmoklasisty/',
  '/oferta/seniorzy/',
  '/oferta/online/',
  '/lokalizacje/',
  '/cennik/',
  '/kariera/',
  '/polityka-prywatnosci/',
]

const zbadaj = (page) =>
  page.evaluate((sel) => {
    const numery = [...document.querySelectorAll(sel)]
    return numery.map((el) => {
      /* Czy przeglądarka FAKTYCZNIE da focus - `tabIndex` sam tego nie mówi. */
      el.focus()
      return {
        maHref: el.hasAttribute('href'),
        zapamietany: el.dataset.telHref ?? null,
        widocznyNumer: el.textContent.replace(/\s+/g, ' ').includes('790 266 517'),
        fokusowalny: document.activeElement === el,
      }
    })
  }, SELEKTOR)

test.describe('numer telefonu - forma zalezna od urzadzenia', () => {
  test('na wskazniku zaden numer nie jest odnosnikiem', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'ten projekt ma mysz')

    for (const url of STRONY) {
      await page.goto(url)
      const numery = await zbadaj(page)

      expect(numery.length, `sa numery na ${url}`).toBeGreaterThan(0)

      for (const [i, n] of numery.entries()) {
        expect(n.maHref, `${url} numer ${i + 1} bez href`).toBe(false)
        expect(n.zapamietany, `${url} numer ${i + 1} pamieta cel`).toBe(NUMER)
        expect(n.widocznyNumer, `${url} numer ${i + 1} nadal widoczny`).toBe(true)
        /*
         * Element bez `href` wypada z nawigacji klawiatura i z drzewa
         * dostepnosci jako link - inaczej czytnik zapowiadalby odnosnik,
         * ktory niczego nie robi.
         */
        expect(n.fokusowalny, `${url} numer ${i + 1} poza kolejnoscia focusu`).toBe(false)
      }
    }
  })

  test('na dotyku kazdy numer jest odnosnikiem tel:', async ({ browser }) => {
    const kontekst = await browser.newContext({ ...devices['iPhone 13'] })
    const strona = await kontekst.newPage()

    try {
      for (const url of STRONY) {
        await strona.goto(url)
        const numery = await zbadaj(strona)

        expect(numery.length, `sa numery na ${url}`).toBeGreaterThan(0)

        for (const [i, n] of numery.entries()) {
          expect(n.maHref, `${url} numer ${i + 1} jest odnosnikiem`).toBe(true)
          expect(n.widocznyNumer, `${url} numer ${i + 1} widoczny`).toBe(true)
        }

        await expect(
          strona.locator('a[href^="tel:"]').first(),
          `cel odnosnika na ${url}`,
        ).toHaveAttribute('href', NUMER)
      }
    } finally {
      await kontekst.close()
    }
  })

  /*
   * Numer ma wygladac jak tekst, a nie jak link, ktory nie dziala.
   * Kursor jest tu jedynym sygnalem - projekt nie podkresla odnosnikow.
   */
  test('na wskazniku numer nie udaje odnosnika', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'kursor ma sens tylko na wskazniku')

    await page.goto('/')

    const numer = page.locator('#kontakt').locator(SELEKTOR).first()
    const mail = page.locator('#kontakt a[href^="mailto:"]').first()

    await numer.hover()
    await expect(numer).toHaveCSS('cursor', 'auto')

    /* E-mail obok jest odnosnikiem zawsze - `mailto:` dziala na kazdym urzadzeniu. */
    await mail.hover()
    await expect(mail).toHaveCSS('cursor', 'pointer')
  })

  /*
   * Stopka niesie numer na wszystkich stronach i to ona byla dotad jedynym
   * klikalnym miejscem. Po zmianie zachowuje sie tak samo jak reszta.
   */
  test('stopka niesie numer na kazdej stronie', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const wStopce = page.locator('.site-footer').locator(SELEKTOR)
      await expect(wStopce, `stopka na ${url}`).toHaveCount(1)
      await expect(wStopce).toContainText(WIDOCZNY)
    }
  })
})
