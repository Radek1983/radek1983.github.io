import { expect, test } from '@playwright/test'

/**
 * /oferta/dzieci/ — podstrona zatwierdzona przez właściciela.
 *
 * Zamknięcie strony przebudowane 17.09.2026 według obrazu referencyjnego:
 * zamiast zwykłego bloku kontaktowego z kapsułą stoi tu czerwony akt ZAPISÓW,
 * a wezwanie z nagłówka strony celuje w jego kotwicę zamiast odsyłać na stronę
 * główną.
 *
 * Czego pilnujemy:
 *   1. czerwony akt z eyebrow, plakatowym nagłówkiem, leadem i trzema drogami
 *      kontaktu — BEZ przycisku,
 *   2. osobny adres zapisowy, inny niż ogólny adres serwisu,
 *   3. kotwica #zapisy-klasy-1-7 i celujące w nią wezwanie z nagłówka,
 *   4. po skoku z menu etykieta zatrzymuje się pod sticky headerem,
 *   5. w hero NIE MA drugiego wezwania — droga zapisu jest jedna,
 *   6. pozostałe strony zachowały swoje cele wezwania,
 *   7. stopka jest dokładnie ta sama co na innych stronach.
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D18).
 */

const SIGNAL = 'rgb(242, 59, 47)'

/* Adres ZAPISOWY - celowo inny niz ogolny kontakt.@highfive.academy ze stopki. */
const MAIL_ZAPISY = 'highfive.zapisy@gmail.com'

test.describe('/oferta/dzieci/ - strona zatwierdzona', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/oferta/dzieci/')
  })

  test('czerwony akt zapisow zamyka strone', async ({ page }) => {
    const sekcja = page.locator('#zapisy-klasy-1-7')
    await expect(sekcja).toHaveCount(1)
    await expect(sekcja).toHaveCSS('background-color', SIGNAL)

    // To sekcja ZAPISOW, nie "Kontakt" - naglowek niesie pytanie o decyzje.
    await expect(page.locator('#dzieci-cta')).toHaveText('Gotowi na start?')
    await expect(sekcja.locator('.enroll__eyebrow')).toContainText('Zapisy')

    // Ostatnia sekcja <main>, tuz nad stopka.
    const ostatnia = await page.evaluate(
      () => document.querySelector('main > section:last-of-type').id,
    )
    expect(ostatnia).toBe('zapisy-klasy-1-7')
  })

  /*
   * Brak przycisku jest warunkiem postawionym przez wlasciciela wprost:
   * dane kontaktowe maja byc dostepne od razu, a nie za kolejnym klikiem.
   */
  test('w sekcji zapisow nie ma zadnego przycisku', async ({ page }) => {
    await expect(page.locator('#zapisy-klasy-1-7 .cta')).toHaveCount(0)
  })

  test('trzy drogi kontaktu w zatwierdzonym brzmieniu', async ({ page }) => {
    const pozycje = page.locator('.enroll__item')
    await expect(pozycje).toHaveCount(3)

    for (const [i, [etykieta, wartosc]] of [
      ['E-mail', MAIL_ZAPISY],
      ['Telefon', '+48 790 266 517'],
      ['Godziny kontaktu tel.', '17:00–21:00'],
    ].entries()) {
      await expect(pozycje.nth(i).locator('.enroll__label')).toHaveText(etykieta)
      await expect(pozycje.nth(i).locator('.enroll__value')).toContainText(wartosc)
    }

    // Godziny z POLPAUZA, nie z dywizem - zakres, nie lacznik.
    await expect(pozycje.nth(2)).toContainText('17:00–21:00')

    await expect(pozycje.nth(0).locator('a')).toHaveAttribute('href', `mailto:${MAIL_ZAPISY}`)
    await expect(pozycje.nth(1).locator('a')).toHaveAttribute('href', 'tel:+48790266517')
  })

  /*
   * Adres zapisowy jest WYJATKIEM od jednego zrodla danych kontaktowych.
   * Ogolny adres serwisu stoi dalej w stopce tej samej strony - gdyby ktos
   * "posprzatal" sekcje do {{EMAIL}}, ten test to zlapie.
   */
  test('adres zapisowy rozni sie od ogolnego adresu ze stopki', async ({ page }) => {
    await expect(page.locator('.enroll__value a').first()).toHaveAttribute(
      'href',
      `mailto:${MAIL_ZAPISY}`,
    )

    const wStopce = await page.evaluate(() =>
      document.querySelector('.site-footer a[href^="mailto:"]').getAttribute('href'),
    )
    expect(wStopce).toBe('mailto:kontakt@highfive.academy')
  })

  /*
   * Droga zapisu jest JEDNA. W hero stalo drugie "Zapisz dziecko" prowadzace
   * na /#kontakt, czyli w inne miejsce niz to samo wezwanie z naglowka -
   * wlasciciel kazal je zdjac.
   */
  test('droga zapisu jest jedna i prowadzi w jedno miejsce', async ({ page }) => {
    await expect(page.locator('.page-hero .cta')).toHaveCount(0)

    const cele = await page.evaluate(() =>
      [...document.querySelectorAll('a.cta')]
        .filter((a) => /zapisz dziecko/i.test(a.textContent))
        .map((a) => a.getAttribute('href')),
    )

    expect(cele.length).toBeGreaterThan(0)
    expect(new Set(cele), `cele wezwania: ${cele}`).toEqual(new Set(['#zapisy-klasy-1-7']))
  })

  test('wezwanie z naglowka zostaje na tej stronie', async ({ page }) => {
    await expect(page.locator('.site-header__cta')).toHaveAttribute('href', '#zapisy-klasy-1-7')
  })

  /*
   * Mapa CTA jest kluczowana sciezka pliku, wiec zmiana dotyczyla jednego
   * adresu. Gdyby ktos wpisal kotwice globalnie, pozostale strony zaczelyby
   * celowac w sekcje, ktorej u siebie nie maja.
   */
  test('pozostale strony zachowaly swoje cele wezwania', async ({ page }) => {
    for (const [url, cel] of [
      ['/', '/#kontakt'],
      ['/oferta/', '/#kontakt'],
      // Strona egzaminacyjna dostala wlasna sekcje zapisow 17.09.2026.
      ['/oferta/egzamin-osmoklasisty/', '#zapisy-egzamin-osmoklasisty'],
      // Strona senioralna dostala wlasna sekcje zapisow 18.09.2026.
      ['/oferta/seniorzy/', '#zapisy-seniorzy'],
      ['/oferta/online/', '/#kontakt'],
      ['/cennik/', '/#kontakt'],
      ['/kariera/', '#aplikacja'],
    ]) {
      await page.goto(url)
      await expect(page.locator('.site-header__cta'), url).toHaveAttribute('href', cel)
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

    for (const [width, height] of [
      [1920, 1080],
      [1440, 900],
      [1280, 800],
    ]) {
      test(`trzy rowne kolumny bez poziomego scrolla przy ${width}x${height}`, async ({ page }) => {
        await page.setViewportSize({ width, height })
        await page.goto('/oferta/dzieci/')
        await page.evaluate(() => document.fonts.ready)

        const szerokosci = await page.evaluate(() =>
          [...document.querySelectorAll('.enroll__item')].map((e) =>
            Math.round(e.getBoundingClientRect().width),
          ),
        )
        expect(szerokosci).toHaveLength(3)
        expect(new Set(szerokosci).size, `kolumny ${szerokosci}`).toBe(1)

        const nadmiar = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(nadmiar, 'brak poziomego scrolla').toBeLessThanOrEqual(0)
      })
    }

    /*
     * Naglowek ma WYPELNIAC szerokosc siatki - to cala kompozycja gornej
     * czesci sekcji. Ponizej 85% przestaje byc plakatem, powyzej 100% zostaje
     * uciety przez `overflow-x: clip` na sekcji.
     */
    test('naglowek wypelnia szerokosc siatki i stoi w jednym wierszu', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/oferta/dzieci/')
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
      expect(m.udzial, `wypelnienie ${Math.round(m.udzial * 100)}%`).toBeGreaterThan(0.85)
      expect(m.ucinany, 'naglowek nie jest ucinany').toBeLessThanOrEqual(0)
    })

    /*
     * Kotwica z mega-menu. Globalny scroll-margin nie wie nic o odstepie tej
     * sekcji, wiec bez jego odjecia etykieta ladowala pol ekranu nizej niz
     * czerwona krawedz.
     */
    test('po skoku z kotwicy etykieta stoi pod sticky headerem', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })

      /*
       * Parametr w adresie jest ISTOTNY, nie ozdobny. `beforeEach` wszedl juz
       * na `/oferta/dzieci/`, wiec wejscie na ten sam adres z kotwica byloby
       * nawigacja W OBREBIE dokumentu: bez przeladowania nie wystartowalby
       * `fixHashOnLoad`, a to on poprawia pozycje po ustabilizowaniu ukladu.
       * Ten test ma sprawdzac WEJSCIE na kotwice, czyli droge uzytkownika
       * klikajacego w wezwanie z zewnatrz.
       */
      await page.goto('/oferta/dzieci/?kotwica#zapisy-klasy-1-7')
      await page.evaluate(() => document.fonts.ready)

      /*
       * expect.poll, bo `fixHashOnLoad` poprawia pozycje jeszcze po
       * `document.fonts.ready` i po zdarzeniu `load` - pojedynczy odczyt
       * potrafi zlapac stan sprzed korekty.
       */
      const odstep = () =>
        page.evaluate(() => {
          const r = (s) => document.querySelector(s).getBoundingClientRect()
          return Math.round(r('.enroll__eyebrow').top - r('.site-header').height)
        })

      await expect.poll(odstep, { timeout: 8000 }).toBeLessThanOrEqual(40)
      await expect.poll(odstep, { timeout: 8000 }).toBeGreaterThanOrEqual(0)

      /*
       * Mierzymy WYLACZNIE odstep etykiety od naglowka. Asercja "cala sekcja
       * miesci sie w ekranie po skoku" stala tu przez chwile i byla zla
       * z dwoch powodow: nikt jej nie postawil jako wymogu tej strony (to
       * warunek sekcji 08 strony glownej), a przy wylaczonych animacjach
       * `fixHashOnLoad` poprawia pozycje jeszcze po `load` - pojedynczy odczyt
       * lapal stan w polowie drogi i test byl czerwony bez powodu.
       */
    })
  })
})
