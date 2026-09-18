import { expect, test } from '@playwright/test'

/**
 * /oferta/egzamin-osmoklasisty/ — podstrona zatwierdzona przez właściciela.
 *
 * Zamknięcie strony przebudowane 17.09.2026: zamiast bloku „Chcesz dołączyć?"
 * z kapsułą prowadzącą na stronę główną stoi tu czerwony akt ZAPISÓW,
 * a wezwanie z nagłówka celuje w jego kotwicę.
 *
 * Ta strona jest **wzorcem rytmu** dla wszystkich trzech sekcji zapisów —
 * właściciel wskazał ją wprost 18.09.2026 i kazał dociągnąć do niej pozostałe.
 * Dlatego to tutaj stoi test porównujący trzy strony między sobą.
 *
 * Czego pilnujemy:
 *   1. czerwony akt zamykający stronę, BEZ przycisku,
 *   2. trzy drogi kontaktu z ogólnym adresem serwisu,
 *   3. kotwica #zapisy-egzamin-osmoklasisty i celujące w nią wezwanie,
 *   4. w hero NIE MA drugiego wezwania,
 *   5. wszystkie trzy sekcje zapisów mają ten sam rytm wewnętrzny,
 *   6. stopka jest dokładnie ta sama co na innych stronach.
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D19).
 */

const SIGNAL = 'rgb(242, 59, 47)'

test.describe('/oferta/egzamin-osmoklasisty/ - strona zatwierdzona', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/oferta/egzamin-osmoklasisty/')
  })

  test('czerwony akt zapisow zamyka strone', async ({ page }) => {
    const sekcja = page.locator('#zapisy-egzamin-osmoklasisty')
    await expect(sekcja).toHaveCount(1)
    await expect(sekcja).toHaveCSS('background-color', SIGNAL)

    await expect(page.locator('#egzamin-cta')).toHaveText('Masz pytanie o grupę?')
    await expect(sekcja.locator('.enroll__eyebrow')).toContainText('Kontakt')

    const ostatnia = await page.evaluate(
      () => document.querySelector('main > section:last-of-type').id,
    )
    expect(ostatnia).toBe('zapisy-egzamin-osmoklasisty')
  })

  /*
   * Brak przycisku jest warunkiem postawionym przez wlasciciela wprost:
   * dane kontaktowe maja byc dostepne od razu, a nie za kolejnym klikiem.
   * Wyjatkiem jest wylacznie podstrona senioralna, gdzie zapisow nie
   * prowadzi High Five - patrz tests/e2e/oferta-seniorzy.spec.js.
   */
  test('w sekcji zapisow nie ma zadnego przycisku', async ({ page }) => {
    await expect(page.locator('#zapisy-egzamin-osmoklasisty .cta')).toHaveCount(0)
  })

  test('trzy drogi kontaktu w zatwierdzonym brzmieniu', async ({ page }) => {
    const pozycje = page.locator('.enroll__item')
    await expect(pozycje).toHaveCount(3)

    for (const [i, [etykieta, wartosc]] of [
      ['E-mail', 'kontakt@highfive.academy'],
      ['Telefon', '+48 790 266 517'],
      ['Godziny kontaktu tel.', '17:00–21:00'],
    ].entries()) {
      await expect(pozycje.nth(i).locator('.enroll__label')).toHaveText(etykieta)
      await expect(pozycje.nth(i).locator('.enroll__value')).toContainText(wartosc)
    }

    /*
     * TA strona niesie OGOLNY adres serwisu, w odroznieniu od /oferta/dzieci/,
     * ktora ma wlasny adres zapisowy (D6, D18). Gdyby ktos ujednolicil oba
     * miejsca, ten test i zamek strony dzieci zlapia to z dwoch stron.
     */
    await expect(pozycje.nth(0).locator('a')).toHaveAttribute(
      'href',
      'mailto:kontakt@highfive.academy',
    )
    await expect(pozycje.nth(1).locator('a')).toHaveAttribute('href', 'tel:+48790266517')
  })

  test('droga kontaktu jest jedna i prowadzi w jedno miejsce', async ({ page }) => {
    await expect(page.locator('.page-hero .cta')).toHaveCount(0)

    const cele = await page.evaluate(() =>
      [...document.querySelectorAll('a.cta')]
        .filter((a) => /zapytaj o grup/i.test(a.textContent))
        .map((a) => a.getAttribute('href')),
    )

    expect(cele.length).toBeGreaterThan(0)
    expect(new Set(cele), `cele wezwania: ${cele}`).toEqual(
      new Set(['#zapisy-egzamin-osmoklasisty']),
    )
  })

  /*
   * ZADNA etykieta na tej stronie nie ma juz poziomej kreski.
   *
   * Ta podstrona byla jedynym miejscem w serwisie, gdzie etykieta sekcji
   * zamieniala sie w siatke, a pseudoelement ciagnal linie 1 px do prawej
   * krawedzi. Wlasciciel kazal ja zdjac 18.09.2026 - najpierw w hero, potem
   * wszedzie, bo po polowicznej zmianie strona miala dwa rodzaje etykiet.
   * Pozostale trzy podstrony ofertowe takiej kreski nigdy nie mialy.
   */
  test('etykiety sekcji nie maja poziomej kreski', async ({ page }) => {
    const etykiety = await page.evaluate(() =>
      [...document.querySelectorAll('.section__label')].map((el) => ({
        display: getComputedStyle(el).display,
        kreska: getComputedStyle(el, '::after').content,
      })),
    )

    expect(etykiety.length).toBeGreaterThan(1)
    for (const [i, e] of etykiety.entries()) {
      expect(e.kreska, `kreska przy etykiecie ${i}`).toBe('none')
      expect(e.display, `uklad etykiety ${i}`).toBe('flex')
    }
  })

  test('stopka jest dokladnie ta sama co na stronie glownej', async ({ page }) => {
    const zPodstrony = await page.locator('.site-footer').innerHTML()
    await page.goto('/')
    const zGlownej = await page.locator('.site-footer').innerHTML()

    expect(zPodstrony, 'stopka bez zmian').toBe(zGlownej)
  })

  test.describe('geometria desktopowa', () => {
    test.skip(({ isMobile }) => isMobile, 'trzy kolumny dzialaja od 48rem')

    test('naglowek wypelnia szerokosc siatki i stoi w jednym wierszu', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/oferta/egzamin-osmoklasisty/')
      await page.evaluate(() => document.fonts.ready)

      const m = await page.evaluate(() => {
        const t = document.querySelector('.enroll__title')
        const r = document.createRange()
        r.selectNodeContents(t)
        const c = getComputedStyle(t)
        return {
          udzial: r.getBoundingClientRect().width / t.getBoundingClientRect().width,
          wiersze: Math.round(
            (t.getBoundingClientRect().height -
              parseFloat(c.paddingBlockStart) -
              parseFloat(c.paddingBlockEnd)) /
              parseFloat(c.lineHeight),
          ),
          ucinany: t.scrollWidth - t.clientWidth,
        }
      })

      expect(m.wiersze, 'naglowek w jednym wierszu').toBe(1)
      expect(m.udzial, `wypelnienie ${Math.round(m.udzial * 100)}%`).toBeGreaterThan(0.8)
      expect(m.ucinany, 'naglowek nie jest ucinany').toBeLessThanOrEqual(0)
    })

    test('po skoku z kotwicy etykieta stoi pod sticky headerem', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })

      /*
       * Parametr w adresie jest ISTOTNY: `beforeEach` wszedl juz na ta strone,
       * wiec wejscie na ten sam adres z kotwica byloby nawigacja w obrebie
       * dokumentu i nie wystartowalby `fixHashOnLoad`.
       */
      await page.goto('/oferta/egzamin-osmoklasisty/?kotwica#zapisy-egzamin-osmoklasisty')
      await page.evaluate(() => document.fonts.ready)

      const odstep = () =>
        page.evaluate(() => {
          const r = (s) => document.querySelector(s).getBoundingClientRect()
          return Math.round(r('.enroll__eyebrow').top - r('.site-header').height)
        })

      await expect.poll(odstep, { timeout: 8000 }).toBeLessThanOrEqual(40)
      await expect.poll(odstep, { timeout: 8000 }).toBeGreaterThanOrEqual(0)
    })

    /*
     * WSPOLNY RYTM TRZECH SEKCJI.
     *
     * Kazda z trzech podstron ofertowych zamyka sie ta sama sekcja i przez
     * chwile kazda miala wlasny komplet odstepow - czytaly sie przez to jak
     * trzy rozne moduly mimo identycznej budowy. Wlasciciel wskazal te strone
     * jako wzorzec i kazal dociagnac do niej pozostale dwie.
     *
     * Odstepy pochodza dzis z `components/enroll.css`, wiec rozjazd moze
     * wrocic tylko przez nadpisanie ich w warstwie strony. Ten test to zlapie.
     */
    test('trzy sekcje zapisow maja ten sam rytm wewnetrzny', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })

      const rytm = async (url) => {
        await page.goto(url)
        await page.evaluate(() => document.fonts.ready)

        /*
         * Stan KONCOWY warstwy reveal, zanim cokolwiek zmierzymy.
         *
         * Prostokaty ekranowe niosa takze `translate: 0 1.5rem`, ktorym reveal
         * przesuwa elementy jeszcze nieodsloniete - ta sama sekcja raportowala
         * przez to odstep o 24 px wiekszy tylko dlatego, ze jej kolumny nie
         * weszly jeszcze w kadr (por. tests/e2e/o-high-five.spec.js).
         *
         * Samo dodanie `is-visible` NIE wystarczy: przejscie trwa `--dur-reveal`,
         * czyli ponad pol sekundy, i pomiar lapal stan w polowie drogi.
         * Dlatego po odslonieciu czekamy, az przejscie dobiegnie konca.
         *
         * Gaszenie przejsc wstrzyknietym stylem nie wchodzi w gre - CSP serwisu
         * ma `style-src 'self'` bez `unsafe-inline` i blokuje taki zabieg.
         * To dobrze: polityka dziala tak samo w tescie jak u uzytkownika.
         */
        await page.evaluate(() =>
          document
            .querySelectorAll('[data-animation]')
            .forEach((el) => el.classList.add('is-visible')),
        )
        await page.waitForTimeout(800)

        return page.evaluate(() => {
          const s = document.querySelector('.enroll')
          const cs = getComputedStyle(s)
          const r = (x) => document.querySelector(x).getBoundingClientRect()
          const ink = (x) => {
            const e = document.querySelector(x)
            const zakres = document.createRange()
            zakres.selectNodeContents(e)
            return zakres.getBoundingClientRect()
          }
          return {
            paddingGora: cs.paddingBlockStart,
            paddingDol: cs.paddingBlockEnd,
            etykietaDoNaglowka: Math.round(
              ink('.enroll__title').top - ink('.enroll__eyebrow').bottom,
            ),
            naglowekDoLeadu: Math.round(ink('.enroll__lead').top - ink('.enroll__title').bottom),
            kolumnyDoNotki: Math.round(r('.enroll__note').top - r('.enroll__grid').bottom),
          }
        })
      }

      const wzorzec = await rytm('/oferta/egzamin-osmoklasisty/')

      for (const url of ['/oferta/dzieci/', '/oferta/seniorzy/']) {
        const inny = await rytm(url)

        expect(inny.paddingGora, `padding gorny na ${url}`).toBe(wzorzec.paddingGora)
        expect(inny.paddingDol, `padding dolny na ${url}`).toBe(wzorzec.paddingDol)
        expect(inny.kolumnyDoNotki, `kolumny do notki na ${url}`).toBe(wzorzec.kolumnyDoNotki)

        /*
         * Te dwa odstepy licza sie do TUSZU, a ten zalezy od stopnia pisma -
         * a stopnie sa na kazdej stronie inne i maja takie zostac. Rownosc
         * jest wiec z tolerancja jednego wiersza etykiety, nie co do piksela.
         */
        expect(
          Math.abs(inny.etykietaDoNaglowka - wzorzec.etykietaDoNaglowka),
          `etykieta do naglowka na ${url}: ${inny.etykietaDoNaglowka} vs ${wzorzec.etykietaDoNaglowka}`,
        ).toBeLessThanOrEqual(6)

        expect(
          Math.abs(inny.naglowekDoLeadu - wzorzec.naglowekDoLeadu),
          `naglowek do leadu na ${url}: ${inny.naglowekDoLeadu} vs ${wzorzec.naglowekDoLeadu}`,
        ).toBeLessThanOrEqual(6)
      }
    })
  })
})
