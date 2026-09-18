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
    // Etykieta zmieniona 18.09.2026: zapisy prowadzi Terminal, nie High Five.
    cta: 'Zapytaj o zajęcia',
  },
  {
    url: '/oferta/online/',
    sekcja: 'oferta',
    title: 'Indywidualne lekcje angielskiego online | High Five',
    /*
     * Naglowek rozbity na trzy wiersze 18.09.2026; cyfry w drugim wiaze
     * twarda spacja, wiec `\s+` zamiast zwyklej spacji (par. 5).
     */
    h1: /1\s+na\s+1/i,
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
    /*
     * Brzmienie zmienione przez wlasciciela 16.09.2026 wraz z przebudowa strony.
     * `\s` zamiast spacji, bo "za zajecia" jest zwiazane twarda spacja (U+00A0)
     * zgodnie z regula lamania wierszy z par. 5 - zwykla spacja jej nie dopasuje.
     */
    h1: /Płatność tylko za\s+zajęcia zaplanowane/i,
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
  const OFERTA = ['Klasy 1-7', 'Klasa 8', 'Dla seniorów', 'Online 1 na 1']

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

    // Cztery produkty, cala oferta i cennik.
    await expect(page.locator('.drawer__sublink')).toHaveCount(6)
    await expect(page.locator('.drawer__sublink[href="/oferta/"]')).toBeVisible()
  })
})

test.describe('architektura - tresc i uczciwosc materialu', () => {
  test('zadna cena nie jest zmyslona', async ({ page }) => {
    /*
     * Potwierdzone stawki (CLAUDE.md par. 3): klasy 1-7 (55/50 zl za 45 min),
     * kurs egzaminacyjny (80 zl za 90 min), seniorzy (45 zl za 60 min)
     * i online 1 na 1 (120 zl za 60 min) - dwie ostatnie przekazal wlasciciel
     * 16.09.2026 wraz z przebudowa cennika.
     *
     * Stawka senioralna weszla na wlasna podstrone 19.09.2026, tez na jego
     * polecenie. Strona online nadal ceny NIE podaje - i dopoki wlasciciel
     * nie zdecyduje inaczej, ma jej nie podawac.
     */
    await page.goto('/cennik/')
    await expect(page.locator('body')).toContainText('55 zł / 45 min')
    await expect(page.locator('body')).toContainText('50 zł / 45 min')

    await page.goto('/oferta/egzamin-osmoklasisty/')
    await expect(page.locator('.exam-price')).toHaveText('80 zł / 90 minut')

    await page.goto('/oferta/seniorzy/')
    const senior = await page.locator('main').innerText()
    expect(senior, 'stawka senioralna zgodna z par. 3').toMatch(/45\s*zł\s*\/\s*60\s*min/i)
    expect(senior, 'zadna inna kwota za minuty').not.toMatch(
      /(?!45\s*zł\s*\/\s*60)\b(?!45\b)\d+\s*zł\s*\/\s*\d+\s*min/i,
    )

    await page.goto('/oferta/online/')
    const online = await page.locator('main').innerText()
    expect(online, 'strona online nadal bez ceny').not.toMatch(/\d+\s*z[lł]\s*\/\s*\d+\s*min/i)
  })

  test('kurs egzaminacyjny nie obiecuje wyniku', async ({ page }) => {
    await page.goto('/oferta/egzamin-osmoklasisty/')

    // Wymog briefu - zastrzezenie stoi tam, gdzie opis kursu.
    await expect(page.locator('body')).toContainText(/nie obiecujemy wyniku/i)
  })

  /*
   * Pieciu brakujacych kadrow juz nie ma - wlasciciel dostarczyl zdjecia
   * i sloty .photo-todo zostaly zastapione prawdziwymi <picture>.
   *
   * Test odwrocil sie o 180 stopni, ale pilnuje tej samej rzeczy co
   * przedtem: zadne miejsce na zdjecie nie moze byc UDAWANE. Wczesniej
   * znaczylo to "brak ma byc oznaczony", teraz "braku juz nie ma".
   */
  test('kazde miejsce na zdjecie ma prawdziwy kadr', async ({ page }) => {
    for (const url of ['/oferta/seniorzy/', '/oferta/online/', '/kariera/']) {
      await page.goto(url)
      await expect(page.locator('.photo-todo'), url).toHaveCount(0)

      const media = page.locator('main .media picture img')
      expect(await media.count(), url).toBeGreaterThan(0)

      // Kazdy kadr ma alt, wymiary i nowoczesny format w srcset.
      for (const img of await media.all()) {
        await expect(img).toHaveAttribute('alt', /.{10,}/)
        await expect(img).toHaveAttribute('width', /\d+/)
        await expect(img).toHaveAttribute('height', /\d+/)
      }
      await expect(page.locator('main .media source[type="image/avif"]').first()).toHaveAttribute(
        'srcset',
        /\.avif/,
      )
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

    /*
     * Droga rekrutacyjna musi byc na stronie dostepna WPROST.
     *
     * Do 19.09.2026 niosla ja kapsula ze szkicem maila (`subject=Rekrutacja`).
     * Wlasciciel zastapil ja sekcja kontaktowa bez przycisku: adres i telefon
     * stoja teraz w tresci, a czego oczekujemy w zgloszeniu, mowi lead.
     * Pilnujemy wiec ISTNIENIA drogi kontaktu, nie jej formy.
     */
    const mail = page.locator('#aplikacja a[href^="mailto:"]')
    await expect(mail).toHaveCount(1)
    await expect(mail).toHaveAttribute('href', 'mailto:kontakt@highfive.academy')
    await expect(page.locator('#aplikacja a[href^="tel:"]')).toHaveCount(1)
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

test.describe('mega-menu - dopracowanie', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'menu poziome dziala od 75rem')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
  })

  test('kazda kolumna niesie cztery poziomy informacji', async ({ page }) => {
    await page.locator('.site-nav__trigger').click()

    const kolumny = await page.evaluate(() =>
      [...document.querySelectorAll('.mega__item')].map((li) => ({
        numer: li.querySelector('.mega__number').textContent.trim(),
        etykieta: li.querySelector('.mega__label').textContent.trim(),
        opis: li.querySelector('.mega__desc').textContent.trim(),
        kontekst: li.querySelector('.mega__meta').textContent.trim(),
        cta: li.querySelector('.mega__cta').textContent.trim().replace(/\s+/g, ' '),
        href: li.querySelector('.mega__link').getAttribute('href'),
      })),
    )

    expect(kolumny).toEqual([
      {
        numer: '01',
        etykieta: 'Klasy 1-7',
        opis: 'Angielski po lekcjach',
        kontekst: 'SP 402 · klasy 1-7',
        cta: 'Zobacz zajęcia →',
        href: '/oferta/dzieci/',
      },
      {
        numer: '02',
        etykieta: 'Klasa 8',
        opis: 'Egzamin ósmoklasisty',
        kontekst: 'SP 402 · przygotowanie egzaminacyjne',
        cta: 'Zobacz kurs →',
        href: '/oferta/egzamin-osmoklasisty/',
      },
      {
        numer: '03',
        etykieta: 'Dla seniorów',
        opis: 'Angielski dla seniorów',
        // Prog wiekowy zszedl z etykiety, wiec musi stac tutaj.
        kontekst: '60+ · Terminal Kultury Gocław',
        cta: 'Zobacz zajęcia →',
        href: '/oferta/seniorzy/',
      },
      {
        numer: '04',
        etykieta: 'Online 1 na 1',
        opis: 'Indywidualnie online',
        kontekst: 'Dzieci · młodzież · dorośli',
        cta: 'Zobacz online →',
        href: '/oferta/online/',
      },
    ])
  })

  test('cala powierzchnia kolumny jest klikalna, bez zagniezdzonych linkow', async ({ page }) => {
    await page.locator('.site-nav__trigger').click()

    // Jeden link na kolumne - wezwanie jest spanem w srodku, nie osobnym <a>.
    const zagniezdzone = await page.evaluate(
      () => document.querySelectorAll('.mega__link a').length,
    )
    expect(zagniezdzone).toBe(0)

    /*
     * Klikniecie w PUSTA czesc kolumny, nie w czerwone slowo. Celujemy
     * w obszar numeru, ktory jest tylko dekoracja - a mimo to ma prowadzic.
     */
    await page.locator('.mega__item').nth(2).locator('.mega__number').click()
    await page.waitForURL('**/oferta/seniorzy/')
  })

  test('focus klawiatury daje ten sam sygnal co najechanie', async ({ page }) => {
    /*
     * Stan spoczynkowy czytamy przy ZAMKNIETYM panelu. Wymuszenie jego
     * otwarcia przed testem sprawialo, ze Enter ponizej go zamykal zamiast
     * otwierac - a wtedy Tab wychodzil poza panel i nic sie nie podswietlalo.
     */
    const spoczynek = await page.evaluate(
      () => getComputedStyle(document.querySelector('.mega__number')).color,
    )

    /*
     * Wejscie z KLAWIATURY, nie programowy focus() po klknieciu.
     * :focus-visible wlacza sie tylko wtedy, gdy ostatnia interakcja byla
     * klawiaturowa - a wlasnie ten przypadek testujemy.
     */
    await page.locator('.site-nav__trigger').focus()
    await page.keyboard.press('Enter')
    await page.keyboard.press('Tab')
    await page.waitForTimeout(300)

    const stan = await page.evaluate(() => {
      const link = document.querySelector('.mega__link')
      return {
        numer: getComputedStyle(link.querySelector('.mega__number')).color,
        strzalka: getComputedStyle(link.querySelector('.offer-mark__arrow')).translate,
      }
    })

    expect(stan.numer).not.toBe(spoczynek)
    expect(stan.strzalka).not.toBe('none')
  })

  test('Tab przechodzi przez cztery oferty i dwa odnosniki zbiorcze', async ({ page }) => {
    await page.locator('.site-nav__trigger').focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('.mega')).toBeVisible()

    const kolejnosc = []
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab')
      kolejnosc.push(await page.evaluate(() => document.activeElement.getAttribute('href')))
    }

    expect(kolejnosc).toEqual([
      '/oferta/dzieci/',
      '/oferta/egzamin-osmoklasisty/',
      '/oferta/seniorzy/',
      '/oferta/online/',
      '/oferta/',
      '/cennik/',
    ])
  })

  test('etykieta odnosnika cenowego wynika z kompletnosci danych', async ({ page }) => {
    /*
     * "Porownaj ceny" obiecuje zestawienie czterech kwot obok siebie.
     * Dopoki trzy z czterech produktow nie maja potwierdzonej stawki,
     * taka obietnica wprowadzalaby w blad - etykieta brzmi wtedy "Cennik".
     * Zmieni sie sama, gdy ceny trafia do src/data/offers.mjs.
     */
    const { CENY_KOMPLETNE, LINK_CENNIK } = await import('../../src/data/offers.mjs')

    await page.locator('.site-nav__trigger').click()
    const etykieta = (
      await page.locator('.mega .mega__more a[href="/cennik/"]').textContent()
    ).trim()

    expect(etykieta).toBe(LINK_CENNIK + ' →')
    if (!CENY_KOMPLETNE) expect(etykieta).not.toMatch(/porównaj/i)
  })

  test('strzalka przy Ofercie obraca sie po otwarciu', async ({ page }) => {
    const chevron = page.locator('.site-nav__chevron')
    const zamkniety = await chevron.evaluate((el) => getComputedStyle(el).rotate)

    await page.locator('.site-nav__trigger').click()
    await page.waitForTimeout(300)

    expect(await chevron.evaluate((el) => getComputedStyle(el).rotate)).not.toBe(zamkniety)
  })

  test('panel styka sie z naglowkiem, wiec kursor go nie gubi', async ({ page }) => {
    await page.locator('.site-nav__trigger').click()

    /*
     * Miedzy dolna krawedzia naglowka a gora panelu nie moze byc przerwy -
     * kursor przechodzacy z pozycji menu do kolumny przeciolby przez pustke
     * i zamknal panel.
     */
    const m = await page.evaluate(() => {
      const naglowek = document.querySelector('.site-header').getBoundingClientRect()
      const panel = document.querySelector('.mega').getBoundingClientRect()
      return {
        przerwa: Math.round(panel.top - naglowek.bottom),
        mega: Number(getComputedStyle(document.querySelector('.mega')).zIndex),
        ticker: Number(getComputedStyle(document.querySelector('.ticker')).zIndex),
      }
    })

    expect(m.przerwa).toBeLessThanOrEqual(0)
    expect(m.mega).toBeGreaterThan(m.ticker)
  })

  test('panel nie przesuwa layoutu i miesci cztery rowne kolumny', async ({ page }) => {
    for (const width of [1280, 1366, 1440, 1600, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const przed = await page.evaluate(() => document.body.scrollHeight)
      await page.locator('.site-nav__trigger').click()
      await page.waitForTimeout(200)

      const po = await page.evaluate(() => ({
        wysokosc: document.body.scrollHeight,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        kolumny: [...document.querySelectorAll('.mega__item')].map((li) =>
          Math.round(li.getBoundingClientRect().width),
        ),
      }))

      // Panel jest pozycjonowany bezwzglednie, wiec nie moze wydluzyc strony.
      expect(po.wysokosc, width + ' px').toBe(przed)
      expect(po.overflow, width + ' px').toBeLessThanOrEqual(0)

      // Cztery rowne kolumny, zadna nie sciska sie ponizej czytelnosci.
      expect(new Set(po.kolumny).size, width + ' px').toBe(1)
      expect(po.kolumny[0], width + ' px').toBeGreaterThan(150)
    }
  })
})
