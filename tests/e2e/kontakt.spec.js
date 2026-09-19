import { expect, test } from '@playwright/test'

/**
 * Sekcja 12 KONTAKT.
 *
 * Dwie role naraz: jedyna droga zgloszenia w wersji bez formularza (D2)
 * oraz metryczka firmy. Testy pilnuja obu - i tego, ze dane rejestrowe
 * zgadzaja sie co do znaku z tym, co przekazal wlasciciel.
 */

const FIRMA = {
  Firma: 'High Five Magdalena Germel',
  NIP: '8241730595',
  REGON: '523281712',
  'Działamy od': '2022',
}

test.describe('12 kontakt', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
  })

  test('naglowek, lead, dwa kanaly i wezwanie stoja w tej kolejnosci', async ({ page }) => {
    const sekcja = page.locator('#kontakt')

    await expect(sekcja.locator('.section__label')).toContainText('12')
    await expect(sekcja.locator('#kontakt-title')).toHaveText('Gotowi na High Five?')
    await expect(sekcja.locator('.u-lead')).toContainText('Napisz do nas')

    const kanaly = sekcja.locator('.contact__channel')
    await expect(kanaly).toHaveCount(2)

    /*
     * Telefon jest TEKSTEM, nie odnosnikiem - decyzja wlasciciela. Na
     * desktopie `tel:` niczego sensownego nie robi, a wyglada jak link.
     * Numer zostaje klikalny w stopce, wiec dotkniecie go na telefonie
     * nadal dzwoni.
     */
    await expect(kanaly.nth(0)).toContainText('+48 790 266 517')
    await expect(kanaly.nth(0).locator('a')).toHaveCount(0)

    await expect(kanaly.nth(1).locator('a')).toHaveAttribute(
      'href',
      'mailto:kontakt@highfive.academy',
    )

    /*
     * W sekcji NIE MA przycisku otwierajacego program pocztowy - wlasciciel
     * kazal go zdjac 19.09.2026. Adres jest odnoskiem, wiec droga kontaktu
     * zostaje; znika tylko kapsula, ktora podstawiala gotowy szkic wiadomosci
     * i na komputerze uruchamiala Outlooka.
     */
    await expect(sekcja.locator('.cta')).toHaveCount(0)
    await expect(sekcja.locator('a[href*="mailto:"][href*="subject"]')).toHaveCount(0)

    // Blok formalny stoi PO danych kontaktowych.
    const y = async (s) => (await sekcja.locator(s).boundingBox()).y
    expect(await y('.contact__channels')).toBeGreaterThan(await y('.u-lead'))
    expect(await y('.legal')).toBeGreaterThan(await y('.contact__channels'))
  })

  /*
   * Par. 4 zabrania publikowania danych rejestrowych bez potwierdzenia.
   * Te zostaly przekazane przez wlasciciela - test trzyma je co do znaku,
   * zeby literowka w NIP-ie nie przeszla niezauwazona.
   */
  test('dane firmy sa kompletne i dokladne', async ({ page }) => {
    const pozycje = page.locator('#kontakt .legal__item')
    await expect(pozycje).toHaveCount(4)

    for (const [i, [klucz, wartosc]] of Object.entries(FIRMA).entries()) {
      await expect(pozycje.nth(i).locator('dt')).toHaveText(klucz)
      await expect(pozycje.nth(i).locator('dd')).toHaveText(wartosc)
    }

    // Te same dane w danych strukturalnych - inaczej rozjada sie przy edycji.
    const ld = JSON.parse(
      await page.locator('script[type="application/ld+json"]').first().textContent(),
    )
    expect(ld.legalName).toBe(FIRMA.Firma)
    expect(ld.taxID).toBe(FIRMA.NIP)
    expect(ld.foundingDate).toBe(FIRMA['Działamy od'])
  })

  test('blok formalny jest cichszy niz wezwanie', async ({ page }) => {
    const stopien = (s) =>
      page
        .locator(s)
        .first()
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))

    // Metryczka ma uwiarygadniac, nie konkurowac: stopien tekstu ciaglego.
    expect(await stopien('.legal__value')).toBeLessThan(await stopien('.contact__value'))
    expect(await stopien('.legal__value')).toBeLessThanOrEqual(20)
  })

  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1024, 768],
    [768, 1024],
    [390, 844],
  ]) {
    test(`uklad trzyma sie przy ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      const w = await page.evaluate(() => {
        const nadmiar = (s) => {
          const el = document.querySelector(s)
          return el.scrollWidth - el.clientWidth
        }
        const kolumny = [...document.querySelectorAll('#kontakt .legal__item')].map((el) =>
          Math.round(el.getBoundingClientRect().x),
        )
        return {
          strona: document.documentElement.scrollWidth - window.innerWidth,
          claim: nadmiar('.contact__claim'),
          wartosc: nadmiar('#kontakt .contact__value'),
          kolumny,
        }
      })

      expect(w.strona, 'poziomy scroll').toBeLessThanOrEqual(0)
      expect(w.claim, 'naglowek').toBeLessThanOrEqual(1)
      expect(w.wartosc, 'telefon').toBeLessThanOrEqual(1)

      // Od 48rem cztery pozycje stoja obok siebie, nizej jedna pod druga.
      const rozne = new Set(w.kolumny).size
      expect(rozne, `kolumny danych firmy przy ${width}px`).toBe(width >= 768 ? 4 : 1)
    })
  }
})
