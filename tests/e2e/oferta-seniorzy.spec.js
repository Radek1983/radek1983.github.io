import { expect, test } from '@playwright/test'

/**
 * /oferta/seniorzy/ — podstrona zatwierdzona przez właściciela.
 *
 * Nazwa pliku ma przedrostek `oferta-`, bo `seniorzy.spec.js` jest już zajęty
 * przez sekcję 10 strony głównej (D16). To dwie różne rzeczy.
 *
 * Zamknięcie strony przebudowane 18.09.2026 na czerwony akt ZAPISÓW. Jest to
 * **jedyna z trzech takich sekcji, która ma przycisk** — i jest to decyzja
 * merytoryczna, nie estetyczna: zapisów na te zajęcia nie prowadzi High Five,
 * tylko Terminal Kultury. Wezwanie nie jest więc drugim „napisz do nas",
 * tylko przejściem tam, gdzie decyzja faktycznie zapada.
 *
 * Czego pilnujemy:
 *   1. czerwony akt zamykający stronę z JEDNYM przyciskiem,
 *   2. przycisk prowadzi do Terminala, nie do kontaktu High Five,
 *   3. pierwsza kolumna mówi o zapisach przez Terminal i NIE jest odnośnikiem,
 *   4. w sekcji nie ma adresu e-mail — to nie High Five przyjmuje zapisy,
 *   5. wezwanie w nagłówku brzmi „Zapytaj o zajęcia" i celuje w kotwicę,
 *   6. w hero NIE MA drugiego wezwania,
 *   7. stopka jest dokładnie ta sama co na innych stronach.
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D20).
 */

const SIGNAL = 'rgb(242, 59, 47)'
const INK = 'rgb(10, 10, 10)'
const TERMINAL =
  'https://terminalkultury.pl/portfolio-items/angielski-dla-seniora-grupa-poczatkujaca/'

test.describe('/oferta/seniorzy/ - strona zatwierdzona', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/oferta/seniorzy/')
  })

  test('czerwony akt zapisow zamyka strone', async ({ page }) => {
    const sekcja = page.locator('#zapisy-seniorzy')
    await expect(sekcja).toHaveCount(1)
    await expect(sekcja).toHaveCSS('background-color', SIGNAL)

    await expect(page.locator('#seniorzy-cta')).toHaveText('Zapisy prowadzi Terminal.')
    await expect(sekcja.locator('.enroll__eyebrow')).toContainText('Kontakt')

    const ostatnia = await page.evaluate(
      () => document.querySelector('main > section:last-of-type').id,
    )
    expect(ostatnia).toBe('zapisy-seniorzy')
  })

  /*
   * DOKLADNIE JEDEN przycisk i prowadzi do TERMINALA. Gdyby ktos podpial go
   * pod kontakt High Five, strona obiecywalaby zapisy, ktorych nie przyjmuje.
   */
  test('jedyny przycisk prowadzi do Terminala, nie do kontaktu High Five', async ({ page }) => {
    const przyciski = page.locator('#zapisy-seniorzy .cta')
    await expect(przyciski).toHaveCount(1)

    /*
     * Etykieta mowi wprost, DOKAD prowadzi - tak samo jak starszy odnosnik
     * przy zasadach rozliczenia wyzej na tej stronie. `\s` zamiast spacji,
     * bo krotkie slowo jest zwiazane twarda spacja (par. 5).
     */
    await expect(przyciski).toHaveText(/Zapisy w\s+Terminalu Kultury/i)
    await expect(przyciski).toHaveAttribute('href', TERMINAL)
    await expect(przyciski).toHaveAttribute('target', '_blank')
    await expect(przyciski).toHaveAttribute('rel', /noopener/)
    await expect(przyciski).toHaveCSS('background-color', INK)
  })

  test('trzy kolumny w zatwierdzonym brzmieniu', async ({ page }) => {
    const pozycje = page.locator('.enroll__item')
    await expect(pozycje).toHaveCount(3)

    for (const [i, [etykieta, wartosc]] of [
      ['Zapisy', 'przez stronę Terminala Kultury Gocław'],
      ['Telefon', '+48 790 266 517'],
      ['Godziny kontaktu tel.', '17:00–21:00'],
    ].entries()) {
      await expect(pozycje.nth(i).locator('.enroll__label')).toHaveText(etykieta)
      await expect(pozycje.nth(i).locator('.enroll__value')).toContainText(wartosc)
    }

    /*
     * Pierwsza kolumna jest TEKSTEM, nie odnosnikiem: w sprawie zapisow ma byc
     * jeden cel klikniecia - przycisk do Terminala wyzej.
     */
    await expect(pozycje.nth(0).locator('a')).toHaveCount(0)
    await expect(pozycje.nth(1).locator('a')).toHaveAttribute('href', 'tel:+48790266517')
  })

  /*
   * W tej sekcji NIE MA adresu e-mail. Zapisy prowadzi Terminal, a ogolny
   * adres serwisu stoi dalej w stopce tej samej strony.
   */
  test('sekcja nie podaje adresu e-mail', async ({ page }) => {
    await expect(page.locator('#zapisy-seniorzy a[href^="mailto:"]')).toHaveCount(0)

    const wStopce = await page.evaluate(() =>
      document.querySelector('.site-footer a[href^="mailto:"]').getAttribute('href'),
    )
    expect(wStopce).toBe('mailto:kontakt@highfive.academy')
  })

  /*
   * Etykieta zeszla z "Zapytaj o miejsce": obietnica miejsca byla mocniejsza,
   * niz ta strona moze dowiezc, skoro zapisy prowadzi Terminal.
   */
  test('wezwanie z naglowka brzmi Zapytaj o zajecia i zostaje na stronie', async ({ page }) => {
    const cta = page.locator('.site-header__cta')
    await expect(cta).toHaveText(/Zapytaj o zajęcia/i)
    await expect(cta).toHaveAttribute('href', '#zapisy-seniorzy')
  })

  test('w hero nie ma juz wezwania', async ({ page }) => {
    await expect(page.locator('.page-hero .cta')).toHaveCount(0)
  })

  /*
   * SZCZEGOLY - ZAJECIA W LICZBACH, przebudowane 19.09.2026.
   *
   * Pelna rozpiska trzech grup zeszla tutaj ze strony glownej, gdzie
   * zostala po niej jedna linia. Metryka mowi o TRZECH poziomach, a nie
   * o jednej grupie poczatkujacej, i podaje stawke z jednostka z par. 3.
   */
  test('metryka i trzy poziomy w zatwierdzonym brzmieniu', async ({ page }) => {
    const metryka = page.locator('.cols.u-mt-8 .cols__item')
    await expect(metryka).toHaveCount(3)

    for (const [i, [etykieta, wartosc]] of [
      ['Prowadzi', 'Magdalena Germel'],
      ['Dostępne grupy', /3\s+poziomy/],
      ['Koszt', /45 zł \/ 60 min/],
    ].entries()) {
      await expect(metryka.nth(i).locator('h3')).toHaveText(etykieta)
      await expect(metryka.nth(i).locator('p')).toHaveText(wartosc)
    }

    const poziomy = page.locator('.levels__item')
    await expect(poziomy).toHaveCount(3)

    for (const [i, [numer, nazwa]] of [
      ['01', 'Początkująca'],
      ['02', 'Podstawowa'],
      ['03', 'Średniozaawansowana'],
    ].entries()) {
      await expect(poziomy.nth(i).locator('.levels__number')).toHaveText(numer)
      await expect(poziomy.nth(i).locator('.levels__name')).toHaveText(nazwa)
    }

    /*
     * Stara metryka mowila o jednej grupie i o cenie bez jednostki. Obie
     * wersje wprowadzalyby w blad, wiec pilnujemy, zeby nie wrocily.
     */
    await expect(page.locator('main')).not.toContainText('Grupa początkująca')
    await expect(page.locator('main')).not.toContainText('45 zł za zajęcia')
  })

  /*
   * Moduly poziomow NIE sa kartami: zero obrysu, zero zaokraglen, zero tla.
   * Przez chwile mialy cienka ramke z projektu referencyjnego - wlasciciel
   * cofnal to tego samego dnia. Zostaje sama kreska u gory, jak w krokach.
   */
  test('poziomy nie sa kartami - zostaje sama kreska u gory', async ({ page }) => {
    const styl = await page.evaluate(() =>
      [...document.querySelectorAll('.levels__item')].map((el) => {
        const c = getComputedStyle(el)
        return {
          promien: parseFloat(c.borderTopLeftRadius),
          gora: parseFloat(c.borderTopWidth),
          boki: parseFloat(c.borderLeftWidth) + parseFloat(c.borderRightWidth),
          dol: parseFloat(c.borderBottomWidth),
          cien: c.boxShadow,
        }
      }),
    )

    for (const s of styl) {
      expect(s.promien, 'bez zaokraglen').toBe(0)
      expect(s.gora, 'kreska u gory').toBeGreaterThan(0)
      expect(s.boki + s.dol, 'bez ramki').toBe(0)
      expect(s.cien, 'bez cienia').toBe('none')
    }
  })

  /*
   * Wezwanie do trasy zeszlo z obrysowego wariantu na czarny 18.09.2026 -
   * to byl ostatni przycisk obrysowy w calym serwisie.
   */
  test('wezwanie do trasy jest czarne', async ({ page }) => {
    const trasa = page.locator('a.cta[href*="google.com/maps"]')
    await expect(trasa).toHaveCount(1)
    await expect(trasa).toHaveClass(/cta--ink/)
    await expect(trasa).toHaveCSS('background-color', INK)
  })

  test('stopka jest dokladnie ta sama co na stronie glownej', async ({ page }) => {
    const zPodstrony = await page.locator('.site-footer').innerHTML()
    await page.goto('/')
    const zGlownej = await page.locator('.site-footer').innerHTML()

    expect(zPodstrony, 'stopka bez zmian').toBe(zGlownej)
  })

  test.describe('geometria desktopowa', () => {
    test.skip(({ isMobile }) => isMobile, 'trzy kolumny dzialaja od 48rem')

    test('naglowek w jednym wierszu, lead w dwoch, przycisk przy krawedzi siatki', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/oferta/seniorzy/')
      await page.evaluate(() => document.fonts.ready)

      const m = await page.evaluate(() => {
        const wiersze = (sel) => {
          const e = document.querySelector(sel)
          const c = getComputedStyle(e)
          return Math.round(
            (e.getBoundingClientRect().height -
              parseFloat(c.paddingBlockStart) -
              parseFloat(c.paddingBlockEnd)) /
              parseFloat(c.lineHeight),
          )
        }
        const r = (s) => document.querySelector(s).getBoundingClientRect()
        return {
          naglowekWiersze: wiersze('.enroll__title'),
          leadWiersze: wiersze('.enroll__lead'),
          przyciskVsSiatka: Math.round(r('.enroll__action').right - r('.enroll__grid').right),
          przerwaLeadPrzycisk: Math.round(r('.enroll__action').left - r('.enroll__lead').right),
          szerokosci: [...document.querySelectorAll('.enroll__item')].map((e) =>
            Math.round(e.getBoundingClientRect().width),
          ),
          nadmiar: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        }
      })

      expect(m.naglowekWiersze, 'naglowek w jednym wierszu').toBe(1)
      expect(m.leadWiersze, 'lead w dwoch wierszach').toBe(2)
      expect(m.przyciskVsSiatka, 'przycisk rowno z prawa krawedzia siatki').toBe(0)
      expect(m.przerwaLeadPrzycisk, 'lead nie dotyka przycisku').toBeGreaterThan(24)
      expect(new Set(m.szerokosci).size, `kolumny ${m.szerokosci}`).toBe(1)
      expect(m.nadmiar, 'brak poziomego scrolla').toBeLessThanOrEqual(0)
    })

    test('po skoku z kotwicy etykieta stoi pod sticky headerem', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/oferta/seniorzy/?kotwica#zapisy-seniorzy')
      await page.evaluate(() => document.fonts.ready)

      const odstep = () =>
        page.evaluate(() => {
          const r = (s) => document.querySelector(s).getBoundingClientRect()
          return Math.round(r('.enroll__eyebrow').top - r('.site-header').height)
        })

      await expect.poll(odstep, { timeout: 8000 }).toBeLessThanOrEqual(40)
      await expect.poll(odstep, { timeout: 8000 }).toBeGreaterThanOrEqual(0)
    })
  })
})
