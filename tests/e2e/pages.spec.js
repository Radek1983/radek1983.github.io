import { expect, test } from '@playwright/test'

/**
 * Podstrony: seniorzy, online 1:1 i kariera.
 *
 * Testy pilnuja tego, co latwo zepsuc przy statycznym MPA bez routera:
 * osiagalnosci adresow, spojnosci wspolnego naglowka i stopki, oraz tego,
 * ze wezwanie do dzialania pasuje do odbiorcy danej strony.
 */

const STRONY = [
  {
    url: '/dla-seniorow/',
    page: 'seniorzy',
    title: 'Angielski dla seniorów Gocław | High Five',
    opis: /Terminalu Kultury Gocław/,
    h1: /Angielski dla seniorów/i,
  },
  {
    url: '/online/',
    page: 'online',
    title: 'Indywidualne lekcje angielskiego online | High Five',
    opis: /dla dzieci, młodzieży i dorosłych/,
    h1: /1 na 1/i,
  },
  {
    url: '/kariera/',
    page: 'kariera',
    title: 'Kariera - lektor języka angielskiego | High Five Warszawa',
    opis: /anglistyki, lingwistyki i amerykanistyki/,
    h1: /Uczysz angielskiego/i,
  },
]

test.describe('podstrony - dostepnosc adresow i metadane', () => {
  for (const strona of STRONY) {
    test(`${strona.url} odpowiada, ma jeden h1 i wlasne metadane`, async ({ page }) => {
      const odpowiedz = await page.goto(strona.url)

      // Wejscie bezposrednio z adresu, bez przejscia ze strony glownej.
      expect(odpowiedz.status()).toBe(200)

      await expect(page).toHaveTitle(strona.title)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText(strona.h1)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', strona.opis)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://radek1983.github.io${strona.url}`,
      )
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        'content',
        `https://radek1983.github.io${strona.url}`,
      )
      await expect(page.locator('body')).toHaveAttribute('data-page', strona.page)
    })
  }

  test('kazda podstrona jest w sitemapie', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    for (const strona of STRONY) {
      expect(xml, strona.url).toContain(`https://radek1983.github.io${strona.url}`)
    }
  })
})

test.describe('podstrony - wspolna nawigacja', () => {
  const KOLEJNOSC = [
    'Oferta',
    'Cennik',
    'Lokalizacja',
    'Dla seniorów',
    'Online 1:1',
    'Kariera',
    'FAQ',
    'Kontakt',
  ]

  for (const url of ['/', ...STRONY.map((s) => s.url)]) {
    test(`menu na ${url} ma te sama kolejnosc`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(url)

      /*
       * Naglowek i stopka pochodza z jednego fragmentu wstawianego przy
       * budowaniu. Ten test jest zabezpieczeniem na wypadek, gdyby ktos
       * wkleil markup do pojedynczej strony zamiast zmienic fragment.
       */
      const menu = await page.locator('.site-nav__link').allTextContents()
      expect(menu.map((t) => t.trim())).toEqual(KOLEJNOSC)

      const szuflada = await page.locator('.drawer__link').allTextContents()
      expect(szuflada.map((t) => t.trim())).toEqual(KOLEJNOSC)
    })
  }

  test('biezaca pozycja menu jest wyrozniona', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    for (const strona of STRONY) {
      await page.goto(strona.url)
      const kolory = await page.evaluate((klucz) => {
        const aktywny = document.querySelector(`.site-nav__link[data-nav="${klucz}"]`)
        const inny = document.querySelector('.site-nav__link[data-nav="faq"]')
        return {
          aktywny: getComputedStyle(aktywny).color,
          inny: getComputedStyle(inny).color,
        }
      }, strona.page)

      expect(kolory.aktywny, strona.url).not.toBe(kolory.inny)
    }
  })

  test('na kazdej stronie widac dokladnie jedno CTA w naglowku', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    for (const url of ['/', '/dla-seniorow/', '/online/', '/kariera/']) {
      await page.goto(url)
      const widoczne = await page.evaluate(() =>
        [...document.querySelectorAll('.site-header__cta')]
          .filter((el) => getComputedStyle(el).display !== 'none')
          .map((el) => el.textContent.trim().replace(/\s+/g, ' ')),
      )

      expect(widoczne, url).toHaveLength(1)

      /*
       * Na stronie kariery wezwanie sprzedazowe byloby pomylka: kandydat
       * nie zapisuje dziecka. Odwrotnie na pozostalych stronach.
       */
      if (url === '/kariera/') expect(widoczne[0]).toMatch(/Aplikuj/)
      else expect(widoczne[0]).toMatch(/Zapisz dziecko/)
    }
  })

  test('stopka linkuje do wszystkich podstron', async ({ page }) => {
    await page.goto('/kariera/')
    for (const strona of STRONY) {
      await expect(page.locator(`.site-footer a[href="${strona.url}"]`)).toHaveCount(1)
    }
  })
})

test.describe('podstrony - tresc i uczciwosc materialu', () => {
  test('brakujace zdjecia sa oznaczone, a nie udawane', async ({ page }) => {
    /*
     * CLAUDE.md par. 4 zabrania sugerowania, ze placeholder pokazuje
     * rzeczywiste zajecia. Zamiast przypadkowego kadru ze stocka stoi tu
     * widoczny opis potrzebnego zdjecia.
     */
    for (const strona of STRONY) {
      await page.goto(strona.url)
      const braki = page.locator('.photo-todo')
      expect(await braki.count(), strona.url).toBeGreaterThan(0)
      await expect(braki.first()).toContainText('Potrzebny kadr')
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

  test('strona seniorow podaje prawdziwy adres i realne zdjecie budynku', async ({ page }) => {
    await page.goto('/dla-seniorow/')

    await expect(page.locator('body')).toContainText('Jana Nowaka-Jeziorańskiego 24')
    await expect(page.locator('#lokalizacja img')).toHaveAttribute('src', /terminal-kultury/)

    // Trasa prowadzi do Terminalu, nie do SP 402.
    const mapa = page.locator('a[href*="google.com/maps"]')
    await expect(mapa).toHaveAttribute('href', /Terminal\+Kultury/)
    await expect(mapa).toHaveAttribute('rel', /noopener/)
  })

  test('strona online nie zaweza oferty do doroslych', async ({ page }) => {
    await page.goto('/online/')

    // Wymog wlasciciela: glownym odbiorca sa rowniez dzieci i mlodziez.
    await expect(page.locator('h1 + *, .page-hero__lead').first()).toContainText(/dzieci/i)
    await expect(page.locator('body')).toContainText(/rodzicem/i)
  })

  test('strona kariery nie miesza sciezki rekrutacyjnej ze sprzedazowa', async ({ page }) => {
    await page.goto('/kariera/')

    const cta = page.locator('main a.cta')
    const etykiety = (await cta.allTextContents()).map((t) => t.trim().replace(/\s+/g, ' '))

    for (const etykieta of etykiety) {
      expect(etykieta, 'CTA sprzedazowe w tresci kariery').not.toMatch(/zapisz dziecko/i)
    }

    // Zgloszenie idzie mailem z gotowym tematem - formularza w v1 nie ma (D2).
    const zgloszenie = page.locator('main a[href^="mailto:"]')
    await expect(zgloszenie).toHaveAttribute('href', /subject=Rekrutacja/)
  })

  test('podstrony nie publikuja fraz zabronionych przez brief', async ({ page }) => {
    for (const strona of STRONY) {
      await page.goto(strona.url)
      const tekst = (await page.locator('body').innerText()).toLowerCase()

      for (const zabronione of ['gwarantujemy', 'najwyższa jakość', 'nowoczesne metody']) {
        expect(tekst, `${strona.url}: ${zabronione}`).not.toContain(zabronione)
      }
    }
  })
})

test.describe('podstrony - szuflada mobilna', () => {
  test('szuflada otwiera sie, lapie focus i zamyka na Escape', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-safari', 'szuflada dziala ponizej 75rem')

    await page.goto('/online/')

    const szuflada = page.locator('.drawer')
    const przelacznik = page.locator('.site-header__toggle')

    await expect(szuflada).toBeHidden()
    await expect(przelacznik).toHaveAttribute('aria-expanded', 'false')

    await przelacznik.click()
    await expect(szuflada).toBeVisible()
    await expect(przelacznik).toHaveAttribute('aria-expanded', 'true')

    // Focus ma wejsc do panelu, a nie zostac na przycisku pod przyslona.
    const wPanelu = await page.evaluate(
      () => document.activeElement.closest('.drawer__panel') !== null,
    )
    expect(wPanelu).toBe(true)

    await page.keyboard.press('Escape')
    await expect(szuflada).toBeHidden()
    await expect(przelacznik).toHaveAttribute('aria-expanded', 'false')

    // Focus wraca tam, skad wyszedl - inaczej uzytkownik klawiatury gubi miejsce.
    const naPrzelaczniku = await page.evaluate(() =>
      document.activeElement.classList.contains('site-header__toggle'),
    )
    expect(naPrzelaczniku).toBe(true)
  })

  test('bez JavaScriptu nawigacja nie znika', async ({ browser }) => {
    /*
     * Szuflada jest sterowana skryptem, wiec przy jego awarii menu byloby
     * nieosiagalne. Te same osiem pozycji stoi w stopce, w zwyklym HTML.
     */
    const kontekst = await browser.newContext({ javaScriptEnabled: false })
    const strona = await kontekst.newPage()
    await strona.goto('/dla-seniorow/')

    await expect(strona.locator('.site-footer a[href="/online/"]')).toBeVisible()
    await expect(strona.locator('.site-footer a[href="/kariera/"]')).toBeVisible()
    await expect(strona.locator('.drawer')).toBeHidden()

    await kontekst.close()
  })
})
