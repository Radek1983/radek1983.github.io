import { expect, test } from '@playwright/test'

/**
 * Architektura serwisu po rozdzieleniu na hub oferty i podstrony produktowe.
 *
 * Testy pilnuja tego, co latwo zepsuc w statycznym MPA bez routera:
 * osiagalnosci adresow, dzialania starych linkow, spojnosci wspolnego
 * naglowka oraz tego, ze wezwanie do dzialania pasuje do odbiorcy strony.
 */

const STRONY = [
  {
    url: '/oferta/',
    sekcja: 'oferta',
    title: 'Oferta kursów języka angielskiego | High Five Warszawa',
    h1: /Wybierz swój angielski/i,
    cta: 'Zapytaj o zajęcia',
  },
  {
    url: '/oferta/dzieci/',
    sekcja: 'oferta',
    title: 'Angielski dla dzieci klas 1-7 | High Five Warszawa',
    h1: /Po lekcjach/i,
    cta: 'Zapisz dziecko',
  },
  {
    url: '/oferta/egzamin-osmoklasisty/',
    sekcja: 'oferta',
    title: 'Angielski - egzamin ósmoklasisty | High Five Warszawa',
    h1: /Przygotuj się do egzaminu/i,
    cta: 'Zapytaj o grupę',
  },
  {
    url: '/oferta/seniorzy/',
    sekcja: 'oferta',
    title: 'Angielski dla seniorów Gocław | High Five',
    h1: /Angielski dla seniorów/i,
    cta: 'Zapytaj o miejsce',
  },
  {
    url: '/oferta/online/',
    sekcja: 'oferta',
    title: 'Indywidualne lekcje angielskiego online | High Five',
    h1: /1 na 1/i,
    cta: 'Umów lekcję',
  },
  {
    url: '/lokalizacje/',
    sekcja: 'lokalizacje',
    title: 'Lokalizacje zajęć | High Five Warszawa',
    h1: /Nasze lokalizacje/i,
    cta: 'Zapytaj o zajęcia',
  },
  {
    url: '/cennik/',
    sekcja: 'cennik',
    title: 'Cennik zajęć z angielskiego | High Five Warszawa',
    h1: /Prosto\. Bez niespodzianek/i,
    cta: 'Zapytaj o zajęcia',
  },
  {
    url: '/kariera/',
    sekcja: 'kariera',
    title: 'Kariera - lektor języka angielskiego | High Five Warszawa',
    h1: /Uczysz angielskiego/i,
    cta: 'Aplikuj',
  },
]

test.describe('architektura - adresy i metadane', () => {
  for (const strona of STRONY) {
    test(`${strona.url} odpowiada i ma wlasne metadane`, async ({ page }) => {
      // Wejscie bezposrednio z adresu, bez przejscia ze strony glownej.
      const odpowiedz = await page.goto(strona.url)
      expect(odpowiedz.status()).toBe(200)

      await expect(page).toHaveTitle(strona.title)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText(strona.h1)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://radek1983.github.io${strona.url}`,
      )
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        'content',
        `https://radek1983.github.io${strona.url}`,
      )
      await expect(page.locator('body')).toHaveAttribute('data-section', strona.sekcja)
    })
  }

  test('sitemap wymienia wszystkie strony i zadnego starego adresu', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()

    for (const strona of STRONY) {
      expect(xml, strona.url).toContain(`https://radek1983.github.io${strona.url}`)
    }
    expect(xml).toContain('https://radek1983.github.io/')

    // Stare adresy sa przekierowaniami - nie wolno ich indeksowac.
    expect(xml).not.toContain('/dla-seniorow/')
    expect(xml).not.toContain('https://radek1983.github.io/online/')
  })
})

test.describe('architektura - stare adresy', () => {
  /*
   * GitHub Pages nie potrafi odpowiedziec kodem 301, wiec przekierowanie
   * robi meta refresh. Test sprawdza to, co realnie widzi uzytkownik
   * i wyszukiwarka: dojscie pod nowy adres, canonical i noindex.
   */
  for (const [stary, nowy] of [
    ['/dla-seniorow/', '/oferta/seniorzy/'],
    ['/online/', '/oferta/online/'],
  ]) {
    test(`${stary} prowadzi do ${nowy}`, async ({ page }) => {
      await page.goto(stary)
      await page.waitForURL(`**${nowy}`, { timeout: 5000 })

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://radek1983.github.io${nowy}`,
      )
    })

    test(`${stary} nie trafia do indeksu`, async ({ page }) => {
      // Bez JavaScriptu i bez czekania na przekierowanie - czytamy sam dokument.
      const odpowiedz = await page.request.get(stary)
      const html = await odpowiedz.text()

      expect(odpowiedz.status()).toBe(200)
      expect(html).toContain('noindex')
      expect(html).toContain(`https://radek1983.github.io${nowy}`)
    })
  }
})

test.describe('architektura - wspolna nawigacja', () => {
  const MENU = ['Oferta', 'Lokalizacje', 'O High Five', 'FAQ', 'Kontakt', 'Kariera']
  const OFERTA = ['Klasy 1-7', 'Klasa 8', '60+', '1 na 1']

  for (const url of ['/', ...STRONY.map((s) => s.url)]) {
    test(`menu na ${url} ma te sama kolejnosc`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(url)

      /*
       * Naglowek pochodzi z jednego fragmentu wstawianego przy budowaniu,
       * a lista oferty z src/data/offers.mjs. Ten test jest zabezpieczeniem
       * na wypadek, gdyby ktos wkleil markup do pojedynczej strony.
       */
      const menu = await page.locator('.site-nav__list > li > .site-nav__link').allTextContents()
      expect(menu.map((t) => t.trim().replace(/\s*↓$/, ''))).toEqual(MENU)

      const oferta = await page.locator('.mega__label').allTextContents()
      expect(oferta.map((t) => t.trim())).toEqual(OFERTA)
    })
  }

  test('cennik, seniorzy i online nie sa pozycjami pierwszego poziomu', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    /*
     * Decyzja architektoniczna wlasciciela: cena nalezy do produktu,
     * a seniorzy i online sa czescia oferty, nie kategoriami obok niej.
     */
    const menu = (
      await page.locator('.site-nav__list > li > .site-nav__link').allTextContents()
    ).join(' | ')

    expect(menu).not.toMatch(/cennik/i)
    expect(menu).not.toMatch(/seniorów/i)
    expect(menu).not.toMatch(/online/i)

    // Ale cennik musi byc osiagalny - z mega-menu i ze stopki.
    await expect(page.locator('.mega a[href="/cennik/"]')).toHaveCount(1)
    await expect(page.locator('.site-footer a[href="/cennik/"]')).toHaveCount(1)
  })

  test('pozycja Oferta jest aktywna na wszystkich czterech produktach', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    const kolor = async (url) => {
      await page.goto(url)
      return page.evaluate(() => ({
        oferta: getComputedStyle(document.querySelector('.site-nav__trigger')).color,
        inny: getComputedStyle(document.querySelector('.site-nav__link[data-nav="faq"]')).color,
      }))
    }

    for (const url of ['/oferta/', '/oferta/dzieci/', '/oferta/seniorzy/', '/oferta/online/']) {
      const k = await kolor(url)
      expect(k.oferta, url).not.toBe(k.inny)
    }

    // Na stronie kariery Oferta juz aktywna byc nie moze.
    const k = await kolor('/kariera/')
    expect(k.oferta).toBe(k.inny)
  })

  test('CTA w naglowku zalezy od strony', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    for (const strona of STRONY) {
      await page.goto(strona.url)
      const widoczne = await page.evaluate(() =>
        [...document.querySelectorAll('.site-header__cta')]
          .filter((el) => getComputedStyle(el).display !== 'none')
          .map((el) => el.textContent.trim().replace(/\s+/g, ' ')),
      )

      expect(widoczne, strona.url).toHaveLength(1)
      expect(widoczne[0], strona.url).toContain(strona.cta)
    }
  })

  test('stopka jest pelna mapa serwisu', async ({ page }) => {
    await page.goto('/kariera/')

    for (const strona of STRONY) {
      await expect(page.locator(`.site-footer a[href="${strona.url}"]`), strona.url).toHaveCount(1)
    }
  })
})

test.describe('architektura - mega-menu', () => {
  test('otwiera sie, zamyka Escape i niesie poprawne aria', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'menu poziome od 75rem')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const przycisk = page.locator('.site-nav__trigger')
    const panel = page.locator('.mega')

    await expect(panel).toBeHidden()
    await expect(przycisk).toHaveAttribute('aria-expanded', 'false')
    await expect(przycisk).toHaveAttribute('aria-controls', 'mega-oferta')

    await przycisk.click()
    await expect(panel).toBeVisible()
    await expect(przycisk).toHaveAttribute('aria-expanded', 'true')

    // Cztery produkty plus dwa odnosniki zbiorcze.
    await expect(panel.locator('.mega__item')).toHaveCount(4)
    await expect(panel.locator('a[href="/oferta/"]')).toHaveCount(1)

    await page.keyboard.press('Escape')
    await expect(panel).toBeHidden()
    await expect(przycisk).toHaveAttribute('aria-expanded', 'false')

    // Focus wraca na przycisk, a nie na poczatek dokumentu.
    const naPrzycisku = await page.evaluate(() =>
      document.activeElement.classList.contains('site-nav__trigger'),
    )
    expect(naPrzycisku).toBe(true)
  })

  test('bez JavaScriptu cala oferta jest osiagalna ze stopki', async ({ browser }) => {
    /*
     * Panel jest sterowany skryptem, wiec przy jego awarii cztery produkty
     * musza byc dostepne inna droga. Stopka jest zwyklym HTML.
     */
    const kontekst = await browser.newContext({ javaScriptEnabled: false })
    const strona = await kontekst.newPage()
    await strona.goto('/')

    for (const url of ['/oferta/dzieci/', '/oferta/egzamin-osmoklasisty/', '/oferta/seniorzy/']) {
      await expect(strona.locator(`.site-footer a[href="${url}"]`)).toBeVisible()
    }
    await expect(strona.locator('.mega')).toBeHidden()

    await kontekst.close()
  })

  test('na telefonie oferta rozwija sie bez JavaScriptu', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-safari', 'uklad mobilny')

    await page.goto('/')
    await page.locator('.site-header__toggle').click()

    // <details> daje dzialajace rozwijanie z pudelka - bez wlasnego skryptu.
    const grupa = page.locator('.drawer__group')
    await expect(grupa).toHaveCount(1)
    await grupa.locator('summary').click()

    await expect(page.locator('.drawer__sublink')).toHaveCount(5)
    await expect(page.locator('.drawer__sublink[href="/oferta/"]')).toBeVisible()
  })
})

test.describe('architektura - tresc i uczciwosc materialu', () => {
  test('zadna cena nie jest zmyslona', async ({ page }) => {
    /*
     * Potwierdzona jest wylacznie stawka dla klas 1-7. Pozostale trzy
     * produkty NIE moga podawac zadnej kwoty, dopoki wlasciciel jej nie
     * ustali (CLAUDE.md par. 4). Lista brakow: docs/CONTENT_GAPS.md.
     */
    await page.goto('/cennik/')
    await expect(page.locator('body')).toContainText('55 zł / 60 min')
    await expect(page.locator('body')).toContainText('50 zł / 60 min')

    for (const url of ['/oferta/egzamin-osmoklasisty/', '/oferta/seniorzy/', '/oferta/online/']) {
      await page.goto(url)
      const tekst = await page.locator('main').innerText()
      expect(tekst, url).not.toMatch(/\d+\s*z[lł]\s*\/\s*\d+\s*min/i)
    }
  })

  test('kurs egzaminacyjny nie obiecuje wyniku', async ({ page }) => {
    await page.goto('/oferta/egzamin-osmoklasisty/')

    // Wymog briefu - zastrzezenie stoi tam, gdzie opis kursu.
    await expect(page.locator('body')).toContainText(/nie obiecujemy wyniku/i)
  })

  test('brakujace zdjecia sa oznaczone, a nie udawane', async ({ page }) => {
    for (const url of ['/oferta/seniorzy/', '/oferta/online/', '/kariera/']) {
      await page.goto(url)
      const braki = page.locator('.photo-todo')
      expect(await braki.count(), url).toBeGreaterThan(0)
    }

    // Zaden obraz nie moze pochodzic z obcego hosta - CSP i tak by go odrzucila.
    for (const strona of STRONY) {
      await page.goto(strona.url)
      const obce = await page.evaluate(() =>
        [...document.querySelectorAll('img, source')]
          .map((el) => el.getAttribute('src') || el.getAttribute('srcset') || '')
          .filter((v) => /^https?:/i.test(v)),
      )
      expect(obce, strona.url).toEqual([])
    }
  })

  test('lokalizacje podaja dwa rozne adresy, a online nie jest trzecim miejscem', async ({
    page,
  }) => {
    await page.goto('/lokalizacje/')

    await expect(page.locator('body')).toContainText('Jana Nowaka-Jeziorańskiego 22')
    await expect(page.locator('body')).toContainText('Jana Nowaka-Jeziorańskiego 24')

    // Dwie lokalizacje, dwie mapy - nie trzy.
    await expect(page.locator('a[href*="google.com/maps"]')).toHaveCount(2)
  })

  test('strona kariery nie miesza sciezki rekrutacyjnej ze sprzedazowa', async ({ page }) => {
    await page.goto('/kariera/')

    const etykiety = (await page.locator('main a.cta').allTextContents()).map((t) =>
      t.trim().replace(/\s+/g, ' '),
    )
    for (const etykieta of etykiety) {
      expect(etykieta, 'CTA sprzedazowe w tresci kariery').not.toMatch(/zapisz dziecko/i)
    }

    await expect(page.locator('main a[href^="mailto:"]')).toHaveAttribute(
      'href',
      /subject=Rekrutacja/,
    )
  })

  test('zaden link wewnetrzny nie prowadzi donikad', async ({ page, request }) => {
    /*
     * Po przeniesieniu dwoch podstron latwo zostawic martwy odnosnik
     * w tresci. Sprawdzamy kazdy link wewnetrzny na kazdej stronie.
     */
    const sprawdzone = new Set()

    for (const url of ['/', ...STRONY.map((s) => s.url)]) {
      await page.goto(url)
      const linki = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')]
          .map((el) => el.getAttribute('href'))
          .filter((h) => h.startsWith('/')),
      )

      for (const link of linki) {
        const cel = link.split('#')[0]
        if (cel === '' || sprawdzone.has(cel)) continue
        sprawdzone.add(cel)
        const odpowiedz = await request.get(cel)
        expect(odpowiedz.status(), `${url} -> ${link}`).toBe(200)
      }
    }

    expect(sprawdzone.size).toBeGreaterThan(5)
  })
})
