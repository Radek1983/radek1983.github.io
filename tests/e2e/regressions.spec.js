import { expect, test } from '@playwright/test'

/**
 * Regresje z finalnego passa produkcyjnego.
 *
 * Kazdy test pilnuje ustalenia, ktore juz raz zostalo zlamane albo ktore
 * latwo zlamac przy kolejnej zmianie copy. Opis mowi, co konkretnie poszlo
 * zle - zeby po nieudanym buildzie nie trzeba bylo szukac kontekstu w historii.
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
]

test.describe('regresje tresci', () => {
  /*
   * Oferta zostala rozbita na "klasy 1-7" plus osobny kurs egzaminacyjny
   * dla klasy 8. Zbiorcze "1-8" zostalo w meta, JSON-LD i tickerze jeszcze
   * dlugo po przebudowie IA i mowilo uzytkownikowi cos innego niz menu.
   */
  test('nigdzie nie zostalo zbiorcze "klasy 1-8"', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const html = await page.content()
      expect(html, `zbiorcze 1-8 na ${url}`).not.toMatch(/1\s*[-–]\s*8/)
    }
  })

  /*
   * Jednostka ceny to lekcja 45-minutowa, nie godzina zegarowa. Wczesniejsze
   * "55 zl/godz." obiecywalo rodzicowi 15 minut wiecej niz trwaja zajecia.
   */
  test('cena jest zawsze podana za 45 minut, nigdy za godzine', async ({ page }) => {
    for (const url of ['/', '/cennik/', '/oferta/dzieci/']) {
      await page.goto(url)
      const tekst = await page.locator('body').innerText()

      if (/55 z[lł]/.test(tekst)) {
        expect(tekst, `jednostka ceny na ${url}`).toMatch(/45\s*min/)
      }
      expect(tekst, `godzinowa jednostka na ${url}`).not.toMatch(/z[lł]\s*\/?\s*godz/i)

      /*
       * Zakaz jednostki 60-minutowej obowiazuje tam, gdzie stoi WYLACZNIE
       * oferta dla klas 1-7. Na /cennik/ od 16.09.2026 stoja obok niej takze
       * stawki seniorow i lekcji online - obie za 60 minut i obie przekazane
       * przez wlasciciela, wiec tam jednostka godzinna jest poprawna.
       * Ze stawkami 55 i 50 zl nadal nie moze sie zwiazac: pilnuje tego
       * strukturalna asercja na `.rates__per` w tests/e2e/cennik.spec.js.
       */
      if (url !== '/cennik/') {
        expect(tekst, `60 min na ${url}`).not.toMatch(/60\s*min/)
      }
    }
  })

  /*
   * Model rozliczenia jest faktem przekazanym przez wlasciciela i musi stac
   * przy cenie - bez niego rodzic zaklada abonament miesieczny.
   */
  test('model rozliczenia stoi przy cenie', async ({ page }) => {
    await page.goto('/')

    /*
     * Model rozliczenia to drugi panel sekcji 07, nie osobna sekcja -
     * dlatego szukamy go wewnatrz #cennik. Szczegolowa struktura panelu:
     * tests/e2e/pricing.spec.js.
     */
    const cennik = page.locator('#cennik')
    await expect(cennik.locator('.billing__claim')).toContainText(
      'Płacisz za zajęcia, które się odbywają',
    )
    await expect(cennik).toContainText('Bez stałej miesięcznej opłaty')
  })

  /*
   * Awaria JS nie moze ukryc jedynej drogi kontaktu (D2 w CLAUDE.md).
   * Telefon i mail maja byc klikalne na KAZDEJ stronie, nie tylko na homepage.
   */
  test('kazda strona ma klikalny telefon i mail', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      await expect(page.locator('a[href^="tel:"]').first(), `tel na ${url}`).toHaveAttribute(
        'href',
        'tel:+48790266517',
      )
      await expect(page.locator('a[href^="mailto:"]').first(), `mail na ${url}`).toBeVisible()
    }
  })

  /*
   * Dane kontaktowe zmieniono raz - z prywatnego konta z czasu budowy na
   * firmowe. Stare wartosci nie moga wrocic zadna droga: ani przez cofniety
   * merge, ani przez skopiowany fragment starego HTML-a.
   */
  test('nigdzie nie zostaly stare dane kontaktowe z czasu budowy', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const html = await page.content()
      expect(html, `stary telefon na ${url}`).not.toMatch(/789\D*789\D*789/)
      expect(html, `stary e-mail na ${url}`).not.toMatch(/janek\.gitara/)
    }
  })

  test('e-mail i telefon sa wszedzie te same', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      await expect(
        page.locator('a[href="mailto:highfive.zapisy@gmail.com"]').first(),
        url,
      ).toBeVisible()
    }
  })

  test('stopka nazywa sekcje tak samo jak nawigacja', async ({ page }) => {
    await page.goto('/')
    const stopka = page.locator('.site-footer')

    await expect(stopka).toContainText('O High Five')
    await expect(stopka.locator('a[href="/lokalizacje/"]')).toBeVisible()
    await expect(stopka.locator('a[href="/oferta/"]')).toBeVisible()

    // Disclaimer musi mowic o klasach 1-7 i osobnym kursie egzaminacyjnym.
    await expect(stopka.locator('.site-footer__note')).toContainText('klas 1-7')
    await expect(stopka.locator('.site-footer__note')).toContainText('egzaminu ósmoklasisty')
  })
})

test.describe('regresje layoutu', () => {
  /*
   * `justify-content: center` na tickerze dzielilo nadmiar rowno na obie
   * strony i wypychalo pierwszy element poza lewa krawedz - przy 768 px
   * "Nabor trwa" zaczynalo sie na -440 px. Naprawa: `safe center`.
   */
  test('pierwszy element tickera jest w calosci widoczny', async ({ page }) => {
    for (const width of [768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const left = await page
        .locator('.ticker__item')
        .first()
        .evaluate((el) => el.getBoundingClientRect().left)

      expect(left, `pierwszy element tickera przy ${width}px`).toBeGreaterThanOrEqual(-1)
    }
  })

  /*
   * --step-display skaluje sie do SZEROKOSCI OKNA, a nie do szerokosci
   * kolumny. Przy 1440 px "Krotko." potrzebowalo 587 px w kolumnie szerokiej
   * na 443 px, a `overflow-x: clip` na sekcji ucinalo reszte: widac bylo
   * "FAQ. KROTK" i "GOTOWI NA HIGH" bez "FIVE?".
   */
  test('duze naglowki nie sa ucinane przez kolumne', async ({ page }) => {
    for (const width of [390, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      for (const selektor of ['.faq__title', '.contact__claim']) {
        const nadmiar = await page
          .locator(selektor)
          .evaluate((el) => el.scrollWidth - el.clientWidth)

        expect(nadmiar, `${selektor} przy ${width}px`).toBeLessThanOrEqual(1)
      }
    }
  })
})
