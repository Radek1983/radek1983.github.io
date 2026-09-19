import { expect, test } from '@playwright/test'

/**
 * Testy warstwy wizualno-interakcyjnej. Pilnuja kryteriow VIZ z rozdz. 33
 * specyfikacji oraz zakazow z briefu, ktore da sie sprawdzic automatycznie.
 */

const PAPER = 'rgb(242, 239, 232)'
const INK = 'rgb(10, 10, 10)'
const SIGNAL = 'rgb(242, 59, 47)'
const HF_BLUE = 'rgb(18, 59, 140)'

test.describe('kompozycja i art direction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('sekcje maja zroznicowany rytm, nie jednakowa wysokosc (VIZ-001)', async ({ page }) => {
    const heights = await page
      .locator('main > section')
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().height)))

    expect(heights.length).toBeGreaterThanOrEqual(9)

    // Gdyby kazda sekcja miala te sama wysokosc, mielibysmy sztywny deck slajdow.
    const unique = new Set(heights)
    expect(unique.size).toBeGreaterThan(heights.length / 2)

    const ratio = Math.max(...heights) / Math.min(...heights)
    expect(ratio).toBeGreaterThan(1.5)
  })

  test('kolor zmienia akt narracji (brief, regula 4)', async ({ page }) => {
    const bg = (selector) =>
      page.locator(selector).evaluate((el) => getComputedStyle(el).backgroundColor)

    expect(await bg('#korzysci')).toBe(SIGNAL)
    expect(await bg('#metoda')).toBe(INK)
    expect(await bg('#nabor')).toBe(INK)
    expect(await bg('#cennik')).toBe(PAPER)
    expect(await bg('.site-footer')).toBe(INK)

    /*
     * Granat jako drugi akt marki. Wczesniej niosla go sekcja kursow;
     * po przebudowie architektury szczegoly kursow zyja na podstronach,
     * a na stronie glownej granat zostal przy ofercie senioralnej.
     */
    expect(await bg('#seniorzy')).toBe(HF_BLUE)
  })

  test('hierarchia typograficzna ma wyrazisty poziom display skalowany clamp (VIZ-002)', async ({
    page,
  }) => {
    const wordmark = await page
      .locator('.hero__wordmark')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    const body = await page
      .locator('body')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))

    // Display musi byc radykalnie wieksze od tekstu, nie o dwa stopnie.
    expect(wordmark / body).toBeGreaterThan(4)
  })

  test('brak kart, cieni i zaokraglen jako jezyka layoutu (VIZ-008)', async ({ page }) => {
    const offenders = await page.evaluate(() => {
      const found = []
      for (const el of document.querySelectorAll('main *')) {
        const s = getComputedStyle(el)
        if (s.boxShadow && s.boxShadow !== 'none') found.push(['shadow', el.className])

        // Promien dozwolony wylacznie dla CTA (kapsula) i elementow bez klasy.
        const radius = parseFloat(s.borderRadius) || 0
        const isCta = typeof el.className === 'string' && el.className.includes('cta')
        if (radius > 0 && !isCta) found.push(['radius', el.className])

        if (s.backgroundImage.includes('gradient')) found.push(['gradient', el.className])
      }
      return found
    })

    expect(offenders).toEqual([])
  })

  test('obrazy sa art-directed i responsywne (VIZ-003)', async ({ page }) => {
    // Hero ma osobne zrodlo dla desktopu - to nie ten sam kadr przyciety inaczej.
    await expect(page.locator('.hero__media source[media]')).not.toHaveCount(0)

    // Kazdy obraz ma alt oraz nowoczesny format w srcset.
    const imgs = page.locator('main img')
    const count = await imgs.count()
    expect(count).toBeGreaterThanOrEqual(5)

    for (let i = 0; i < count; i += 1) {
      await expect(imgs.nth(i)).toHaveAttribute('alt', /.+/)
    }

    await expect(page.locator('main source[type="image/avif"]').first()).toHaveAttribute(
      'srcset',
      /\.avif/,
    )
  })

  test('obraz LCP nie jest lazy-loaded, pozostale sa (spec 10.1, 18.3)', async ({ page }) => {
    const hero = page.locator('.hero__media img')
    await expect(hero).toHaveAttribute('fetchpriority', 'high')
    expect(await hero.getAttribute('loading')).toBeNull()

    const belowFold = page.locator('.after-school__media img').first()
    await expect(belowFold).toHaveAttribute('loading', 'lazy')
  })

  test('sekcja metody nie zawiera fotografii - swiadoma przerwa od zdjec', async ({ page }) => {
    await expect(page.locator('#metoda img')).toHaveCount(0)
  })

  test('brak fikcyjnego licznika zapisanych dzieci w sekcji naboru', async ({ page }) => {
    await expect(page.locator('#nabor progress, #nabor meter')).toHaveCount(0)
  })
})

test.describe('oferta dla seniorow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('sekcja stoi poza lejkiem dla rodzicow i niesie motyw granatowy', async ({ page }) => {
    const section = page.locator('#seniorzy')
    await expect(section).toHaveAttribute('data-theme', 'blue')

    // Etykieta bez numeru aktu - to inny odbiorca, nie kolejny krok tej samej decyzji.
    await expect(section.locator('.section__label')).toContainText('Dodatkowo')

    // Sekcja lezy miedzy lokalizacja a FAQ.
    const order = await page
      .locator('main > section[id]')
      .evaluateAll((els) => els.map((el) => el.id))
    expect(order.indexOf('seniorzy')).toBeGreaterThan(order.indexOf('lokalizacja'))
    expect(order.indexOf('seniorzy')).toBeLessThan(order.indexOf('faq'))
  })

  test('fakty i model rozliczenia sa podane wprost', async ({ page }) => {
    /*
     * Szczegoly przenioslу sie na podstrone razem ze skroceniem sekcji
     * na stronie glownej. Zajawka ma zapraszac, a nie powtarzac cala oferte.
     *
     * Model rozliczenia MUSI byc podany wprost: bez tego zastrzezenia
     * "45 zl" czytaloby sie jak tansza alternatywa dla "55 zl", a to inna
     * usluga, inne miejsce i inne zasady (docs/ADR/0005).
     */
    await page.goto('/oferta/seniorzy/')
    const tresc = page.locator('main')

    await expect(tresc).toContainText('Terminal Kultury Gocław')

    /*
     * Cena z JEDNOSTKA, nie sama kwota: "45 zl" bez "za 60 min" czytaloby sie
     * jak tansza wersja zajec dla dzieci (55 zl za 45 min).
     */
    await expect(tresc).toContainText(/45\s*zł\s*\/\s*60\s*min/i)

    /*
     * Zdanie o rozliczeniu miesiecznym zeszlo stad 19.09.2026 na polecenie
     * wlasciciela - zasady organizacyjne prowadzi Terminal i to jego strona
     * ma byc ich zrodlem. Strona musi wiec powiedziec WPROST, ze zapisy
     * i szczegoly sa po stronie Terminala.
     */
    await expect(tresc).toContainText(/zapisy na\s+zajęcia prowadzi Terminal Kultury Gocław/i)
    await expect(tresc).toContainText(/szczegóły organizacyjne znajdziesz na\s+stronie Terminala/i)
  })

  test('konwersja senioralna nie konkuruje z primary CTA', async ({ page }) => {
    /*
     * Zapisy dla seniorow prowadzi Terminal Kultury, wiec odnosnik wychodzi
     * poza serwis. Na stronie glownej zajawka prowadzi juz tylko na podstrone -
     * link zewnetrzny zyje tam, gdzie stoi pelna oferta.
     */
    const zajawka = page.locator('#seniorzy a[href="/oferta/seniorzy/"]')
    await expect(zajawka).toHaveCount(1)

    /*
     * Kapsula jest pelna, bo obrysowa ginela na koncu kolumny - ale NIE
     * czerwona. Czerwien niesie glowna konwersje dla rodzicow i druga taka
     * sama kapsula splaszczylaby hierarchie strony.
     */
    await expect(zajawka).not.toHaveCSS('background-color', 'rgb(242, 59, 47)')
    await expect(zajawka).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

    /*
     * Na podstronie odnosnik zewnetrzny MUSI byc - to tam zapadaja zapisy.
     * Liczba nie jest juz sztywna: od 18.09.2026 stoi tam takze przycisk
     * w sekcji zapisow (D20), obok starszego odnosnika przy zasadach
     * rozliczenia. Warunkiem jest natomiast, zeby KAZDY z nich otwieral sie
     * bezpiecznie - `rel="noopener"` na linku z `target="_blank"`.
     */
    await page.goto('/oferta/seniorzy/')
    const zewnetrzne = page.locator('main a[href^="https://terminalkultury.pl"]')
    expect(await zewnetrzne.count()).toBeGreaterThan(0)

    for (let i = 0; i < (await zewnetrzne.count()); i += 1) {
      await expect(zewnetrzne.nth(i)).toHaveAttribute('rel', /noopener/)
      await expect(zewnetrzne.nth(i)).toHaveAttribute('target', '_blank')
    }
  })

  test('dane strukturalne wymieniaja oba miejsca zajec', async ({ page }) => {
    /*
     * Od 19.09.2026 strona glowna niesie dwa obiekty: organizacje i witryne.
     * Miejsca zajec opisuje pierwszy z nich.
     */
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent()
    const data = JSON.parse(raw)

    expect(Array.isArray(data.location)).toBe(true)
    const names = data.location.map((l) => l.name)
    expect(names.some((n) => n.includes('402'))).toBe(true)
    expect(names.some((n) => n.includes('Terminal Kultury'))).toBe(true)
  })
})

test.describe('02 po lekcjach - scrollytelling', () => {
  const DESKTOP = { width: 1440, height: 900 }

  async function doSekcji(page, offset = 0) {
    await page.evaluate((dy) => {
      const y = window.scrollY + document.querySelector('#po-lekcjach').getBoundingClientRect().top
      window.scrollTo(0, y + dy)
    }, offset)
  }

  test('kadr najpierw jedzie, potem stoi, na koncu odjezdza', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'efekt wylacznie na desktopie')

    await page.setViewportSize(DESKTOP)
    await page.goto('/')

    /*
     * Probkujemy pozycje kadru na calej drodze przez sekcje. Efekt jest
     * poprawny tylko wtedy, gdy widac wszystkie trzy fazy: kadr wjezdza
     * normalnym scrollem, zatrzymuje sie na swojej pozycji i dopiero pod
     * koniec sekcji odjezdza. Sam sticky bez fazy dojazdu czyta sie jak
     * zdjecie przyklejone od pierwszej chwili.
     */
    const start = await page.evaluate(
      () =>
        window.scrollY +
        document.querySelector('#po-lekcjach').getBoundingClientRect().top -
        window.innerHeight,
    )
    const dystans = await page.evaluate(
      () =>
        document.querySelector('#po-lekcjach').getBoundingClientRect().height + window.innerHeight,
    )
    const stickyTop = await page.evaluate(() =>
      Math.round(
        parseFloat(
          getComputedStyle(document.querySelector('.after-school__media')).insetBlockStart,
        ),
      ),
    )

    const pozycje = []
    for (let i = 0; i <= 24; i += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), start + (i / 24) * dystans)
      await page.waitForTimeout(50)
      pozycje.push(
        await page.evaluate(() =>
          Math.round(document.querySelector('.after-school__media').getBoundingClientRect().top),
        ),
      )
    }

    const przed = pozycje.filter((t) => t > stickyTop).length
    const stoi = pozycje.filter((t) => t === stickyTop).length
    const po = pozycje.filter((t) => t < stickyTop).length

    expect(przed, 'faza dojazdu').toBeGreaterThan(2)
    expect(stoi, 'faza sticky').toBeGreaterThan(2)
    expect(po, 'faza odjazdu').toBeGreaterThan(2)
  })

  test('kadr nie wchodzi pod sticky naglowek', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'efekt wylacznie na desktopie')

    await page.setViewportSize(DESKTOP)
    await page.goto('/')
    await doSekcji(page, 600)
    await page.waitForTimeout(300)

    const m = await page.evaluate(() => {
      const media = document.querySelector('.after-school__media')
      return {
        mediaTop: media.getBoundingClientRect().top,
        headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom,
        mediaVh: media.getBoundingClientRect().height / window.innerHeight,
        position: getComputedStyle(media).position,
      }
    })

    expect(m.position).toBe('sticky')
    expect(m.mediaTop).toBeGreaterThanOrEqual(m.headerBottom)

    // Kadr ma byc duzy, ale wciaz miescic sie w oknie razem z naglowkiem.
    expect(m.mediaVh).toBeGreaterThan(0.7)
    expect(m.mediaVh).toBeLessThanOrEqual(0.88)
  })

  test('prawa krawedz kadru stoi w jednej osi z kadrem hero', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'uklad dwukolumnowy')

    /*
     * Wymog wlasciciela: obie fotografie maja tworzyc jedna pionowa linie.
     * Hero jest full-bleed, wiec kadr sekcji 02 musi wyjsc poza siatke
     * o --bleed-inline. Sprawdzamy na kilku szerokosciach, bo ta odleglosc
     * inaczej wyglada przed i po osiagnieciu maksymalnej szerokosci kontenera.
     */
    for (const width of [1280, 1440, 1680, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const m = await page.evaluate(() => ({
        hero: Math.round(document.querySelector('.hero__media').getBoundingClientRect().right),
        sekcja: Math.round(
          document.querySelector('.after-school__media').getBoundingClientRect().right,
        ),
      }))

      expect(m.sekcja, `szerokosc ${width} px`).toBe(m.hero)
    }
  })

  test('przejscie z hero do sekcji jest zwarte', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'uklad dwukolumnowy')

    await page.setViewportSize(DESKTOP)
    await page.goto('/')

    const m = await page.evaluate(() => {
      const hero = document.querySelector('.hero').getBoundingClientRect()
      const eyebrow = document
        .querySelector('.after-school__intro .u-label')
        .getBoundingClientRect()
      const pelny = getComputedStyle(document.querySelector('#faq')).paddingBlockStart
      return { przerwa: eyebrow.top - hero.bottom, pelnyOdstepSekcji: parseFloat(pelny) }
    })

    /*
     * Po pelnowymiarowym kadrze hero pelny odstep sekcyjny czytal sie jak
     * dziura. Ma byc najwyzej polowa tego, co dostaja pozostale sekcje -
     * ale nie zero, bo sekcje nadal maja oddychac.
     */
    expect(m.przerwa).toBeGreaterThan(16)
    expect(m.przerwa).toBeLessThanOrEqual(m.pelnyOdstepSekcji / 2 + 2)
  })

  test('sekcja jest dosc dluga, by kadr rzeczywiscie postal', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'efekt wylacznie na desktopie')

    await page.setViewportSize(DESKTOP)
    await page.goto('/')
    const sekcjaVh = await page.evaluate(
      () =>
        document.querySelector('#po-lekcjach').getBoundingClientRect().height / window.innerHeight,
    )

    /*
     * Widelki po skroceniu odstepow na prosbe wlasciciela. Dolna granica
     * pilnuje, ze zostalo miejsce na realna faze sticky. Gorna pilnuje
     * zakazu sztucznego rozciagania sekcji - wysokosc ma wynikac z odstepow
     * miedzy blokami, nie z min-height.
     */
    expect(sekcjaVh).toBeGreaterThan(1.4)
    expect(sekcjaVh).toBeLessThan(2.2)
  })

  test('puenta wchodzi w koncowce sekcji, zanim kadr sie odklei', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'efekt wylacznie na desktopie')

    await page.setViewportSize(DESKTOP)
    await page.goto('/')

    const m = await page.evaluate(() => {
      const sec = document.querySelector('#po-lekcjach')
      const media = document.querySelector('.after-school__media')
      const punch = document.querySelector('.after-school__block--punch')
      const vh = window.innerHeight
      const top = window.scrollY + sec.getBoundingClientRect().top
      const skok = sec.getBoundingClientRect().height - vh
      const punchBox = punch.getBoundingClientRect()
      const punchTop = window.scrollY + punchBox.top
      const area = media.parentElement.getBoundingClientRect()
      const areaBot = window.scrollY + area.top + area.height
      const stickyTop = parseFloat(getComputedStyle(media).insetBlockStart)
      const odklejenieNa = areaBot - media.getBoundingClientRect().height - stickyTop
      return {
        // Obserwator odslania przy rootMargin -12% od dolu okna.
        revealProc: ((punchTop - vh * 0.88 - top) / skok) * 100,
        zapasPrzedOdklejeniem: odklejenieNa - (punchTop + punchBox.height - vh),
      }
    })

    // Puenta ma dostac wlasny moment, a nie wjechac tuz za trzecim akapitem.
    expect(m.revealProc).toBeGreaterThan(50)
    expect(m.revealProc).toBeLessThan(95)

    // I ma sie skonczyc, zanim kadr zacznie opuszczac stan sticky.
    expect(m.zapasPrzedOdklejeniem).toBeGreaterThan(0)
  })

  /*
   * Wymog "dwa wiersze" ZNIKNAL wraz z trescia, ktorej dotyczyl.
   *
   * Byl zwiazany z krotszym zdaniem konczacym sekcje. Wlasciciel wymienil je
   * na dluzsze, ktore przy tej kolumnie nie ma szans zmiescic sie w dwoch
   * wierszach - i nie ma takiej potrzeby. Zostaje to, co naprawde ma tu byc
   * pilnowane: zdanie nie moze rozlac sie na cala szerokosc kolumny i nie
   * moze zostawiac krotkich slow na koncach wierszy.
   */
  test('puenta trzyma miare i nie rozlewa sie na cala kolumne', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'uklad dwukolumnowy')

    for (const width of [1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const m = await page.evaluate(() => {
        const el = document.querySelector('.after-school__coda')
        return {
          szerokosc: el.getBoundingClientRect().width,
          kolumna: el.parentElement.getBoundingClientRect().width,
          nadmiar: el.scrollWidth - el.clientWidth,
        }
      })

      expect(m.nadmiar, `clipping przy ${width} px`).toBeLessThanOrEqual(1)
      expect(m.szerokosc, `miara przy ${width} px`).toBeLessThanOrEqual(m.kolumna)
    }
  })

  test('wejscie startuje szybko, ale trwa dlugo', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'efekt wylacznie na desktopie')

    /*
     * Najwazniejsze rozroznienie w tej sekcji: opoznienie ma byc male,
     * a czas trwania duzy. Regresja poszlaby w strone "poczekaj dluzej",
     * czyli dokladnie odwrotnie niz prosil wlasciciel.
     *
     * Osobno pilnujemy, ze reveal nie czeka na siatke bezpieczenstwa
     * (2500 ms): clip-path na obserwowanym elemencie zerowal prostokat
     * przeciecia i wlasnie to dawalo kilkusekundowe czekanie.
     */
    await page.setViewportSize(DESKTOP)
    await page.goto('/')
    await doSekcji(page)
    await page.waitForTimeout(700)

    await expect(page.locator('.after-school__claim')).toHaveClass(/is-visible/)
    await expect(page.locator('.after-school__media')).toHaveClass(/is-visible/)

    const czasy = await page.evaluate(() => {
      const ms = (v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000)
      const odczyt = (sel) => {
        const cs = getComputedStyle(document.querySelector(sel))
        return {
          trwanie: ms(cs.transitionDuration.split(',')[0]),
          opoznienie: ms(cs.transitionDelay.split(',')[0]),
        }
      }
      return {
        media: odczyt('.after-school__media'),
        naglowek: odczyt('.after-school__claim'),
        blok: odczyt('.after-school__block'),
      }
    })

    for (const [nazwa, v] of Object.entries(czasy)) {
      expect(v.trwanie, `${nazwa}: czas trwania`).toBeGreaterThanOrEqual(900)
      expect(v.opoznienie, `${nazwa}: opoznienie`).toBeLessThanOrEqual(300)
    }

    // Kolejnosc: kadr, naglowek, tekst.
    expect(czasy.media.opoznienie).toBeLessThan(czasy.naglowek.opoznienie)
    expect(czasy.naglowek.opoznienie).toBeLessThan(czasy.blok.opoznienie)
  })

  test('na telefonie kadr stoi miedzy naglowkiem a tekstem i nie jest sticky', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-safari', 'uklad mobilny')

    await page.goto('/')

    const m = await page.evaluate(() => {
      const intro = document.querySelector('.after-school__intro')
      const media = document.querySelector('.after-school__media')
      const text = document.querySelector('.after-school__text')
      const y = (el) => window.scrollY + el.getBoundingClientRect().top
      return {
        position: getComputedStyle(media).position,
        kolejnosc: y(intro) < y(media) && y(media) < y(text),
        odstepBlokow: parseFloat(getComputedStyle(text).rowGap),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      }
    })

    expect(m.position).toBe('static')
    expect(m.kolejnosc).toBe(true)
    expect(m.overflow).toBeLessThanOrEqual(1)

    /*
     * Na telefonie nie odtwarzamy efektu desktopowego kosztem dlugosci strony.
     * Mierzymy odstep miedzy blokami, a nie wysokosc sekcji: to odstep jest
     * narzedziem rozciagania, a wysokosc zalezy tu od tresci i od tego, ze
     * okno telefonu jest niskie.
     */
    expect(m.odstepBlokow).toBeLessThanOrEqual(48)
  })

  test('przy reduced motion caly tekst sekcji jest w pelni widoczny', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'reduced-motion', 'wariant reduced motion')

    await page.setViewportSize(DESKTOP)
    await page.goto('/')
    await doSekcji(page)
    await page.waitForTimeout(500)

    const opacities = await page.evaluate(() =>
      [...document.querySelectorAll('.after-school__block > *')].map((el) =>
        Number(getComputedStyle(el).opacity),
      ),
    )
    expect(opacities.length).toBeGreaterThan(0)
    for (const o of opacities) expect(o).toBe(1)

    // Maska kadru tez znika, a sticky degraduje sie do bloku statycznego.
    const m = await page.evaluate(() => ({
      position: getComputedStyle(document.querySelector('.after-school__media')).position,
      maska: getComputedStyle(document.querySelector('.after-school__media picture')).clipPath,
    }))
    expect(m.position).toBe('static')

    /*
     * Kadr ma byc nieprzyciety. Dwa zapisy znacza tu to samo: 'none' przed
     * odslonieciem i 'inset(0px)' po nim - zadne nic nie zaslania.
     */
    expect(['none', 'inset(0px)']).toContain(m.maska)
  })
})

test.describe('03 co dziecko zyskuje - pas typograficzny', () => {
  async function doSekcji(page) {
    await page.evaluate(() =>
      window.scrollTo(
        0,
        window.scrollY + document.querySelector('#korzysci').getBoundingClientRect().top,
      ),
    )
  }

  /** Skrajne polozenia pasa na calej drodze przez ekran. */
  async function skrajneZapasy(page, h) {
    const top = await page.evaluate(
      () => window.scrollY + document.querySelector('#korzysci').getBoundingClientRect().top,
    )
    const wysokosc = await page.evaluate(
      () => document.querySelector('#korzysci').getBoundingClientRect().height,
    )

    let lewy = Infinity
    let prawy = Infinity
    for (let i = 0; i <= 16; i += 1) {
      await page.evaluate((y) => window.scrollTo(0, y), top - h + (i / 16) * (wysokosc + h))
      await page.waitForTimeout(40)
      const z = await page.evaluate(() => {
        const kont = document.querySelector('#korzysci .container')
        const kb = kont.getBoundingClientRect()
        const cs = getComputedStyle(kont)
        const elementy = [...document.querySelectorAll('.marquee__word, .marquee__sep')]
        if (elementy.length === 0) return null
        const boxy = elementy.map((e) => e.getBoundingClientRect())
        return {
          l: Math.min(...boxy.map((b) => b.left)) - (kb.left + parseFloat(cs.paddingLeft)),
          p: kb.right - parseFloat(cs.paddingRight) - Math.max(...boxy.map((b) => b.right)),
        }
      })
      if (!z) continue
      lewy = Math.min(lewy, z.l)
      prawy = Math.min(prawy, z.p)
    }
    return { lewy, prawy }
  }

  test('napis miesci sie w calosci, takze w skrajnych punktach ruchu', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'uklad poziomy pasa')

    /*
     * Regresja, ktora ten test lapie: pas jechal od 6vw do -10vw, czyli przy
     * 1920 px o 192 px w lewo, a .marquee mial overflow: hidden z zalozeniem,
     * ze przyciete litery to kadrowanie. Pierwsza litera znikala za krawedzia
     * okna i czytalo sie to jak blad overflow.
     *
     * Sprawdzamy nie stan spoczynkowy, tylko NAJGORSZY punkt animacji.
     */
    for (const width of [1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const z = await skrajneZapasy(page, 900)

      expect(z.lewy, `lewy zapas przy ${width} px`).toBeGreaterThanOrEqual(0)
      expect(z.prawy, `prawy zapas przy ${width} px`).toBeGreaterThanOrEqual(0)
    }
  })

  test('pas to jedna linia z dwoma rombami, bez samotnego symbolu', async ({ page }) => {
    await page.goto('/')

    /*
     * Drugi pas byl odsuniety o -8vw i przy dryfie zostawal z niego w kadrze
     * jeden romb wiszacy w pustce. Pusta przestrzen tej sekcji ma byc czysta -
     * brief zabrania wypelniania jej dekoracja.
     */
    await expect(page.locator('.marquee__row')).toHaveCount(1)
    await expect(page.locator('.marquee__sep')).toHaveCount(2)
    await expect(page.locator('.marquee__word')).toHaveCount(2)

    // Pas jest dekoracja; tresc niesie naglowek dostepny dla czytnikow.
    await expect(page.locator('.marquee')).toHaveAttribute('aria-hidden', 'true')
    await expect(page.locator('#korzysci-title')).toHaveText('Co dziecko zyskuje na zajęciach')
  })

  test('kolumny korzysci wchodza po kolei i nigdy nie znikaja', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'stagger liczony na desktopie')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await doSekcji(page)
    await page.waitForTimeout(900)

    const items = page.locator('.benefits__item')
    await expect(items).toHaveCount(3)

    const stan = await page.evaluate(() =>
      [...document.querySelectorAll('.benefits__item')].map((el) => {
        const cs = getComputedStyle(el)
        const v = cs.transitionDelay.split(',')[0]
        return {
          delay: v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000,
          widoczny: el.classList.contains('is-visible'),
        }
      }),
    )

    // Stagger rosnie, a krok miesci sie w widelkach 80-140 ms na kolumne.
    expect(stan[0].delay).toBe(0)
    expect(stan[1].delay - stan[0].delay).toBeGreaterThanOrEqual(80)
    expect(stan[1].delay - stan[0].delay).toBeLessThanOrEqual(140)
    expect(stan[2].delay - stan[1].delay).toBeGreaterThanOrEqual(80)
    expect(stan[2].delay - stan[1].delay).toBeLessThanOrEqual(140)

    for (const s of stan) expect(s.widoczny).toBe(true)

    /*
     * Stan wyjsciowy to polowa krycia, nie zero: trzy krotkie zdania obok
     * siebie, ktore gasna do konca, czytaja sie jak doladowywanie strony.
     */
    await page.evaluate(() =>
      document.querySelector('.benefits__item').classList.remove('is-visible'),
    )

    /*
     * Odczyt musi poczekac na koniec przejscia. Tuz po zdjeciu klasy
     * getComputedStyle zwraca jeszcze wartosc w trakcie animacji, czyli 1.
     */
    await expect
      .poll(
        async () =>
          Number(
            await page.evaluate(
              () => getComputedStyle(document.querySelector('.benefits__item')).opacity,
            ),
          ),
        { timeout: 3000 },
      )
      .toBeLessThanOrEqual(0.5)

    const wyjsciowa = Number(
      await page.evaluate(
        () => getComputedStyle(document.querySelector('.benefits__item')).opacity,
      ),
    )
    expect(wyjsciowa).toBeGreaterThanOrEqual(0.3)
  })

  test('na telefonie pas idzie w pion i nie powoduje poziomego scrolla', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-safari', 'uklad mobilny')

    await page.goto('/')
    await doSekcji(page)
    await page.waitForTimeout(400)

    const m = await page.evaluate(() => {
      const row = document.querySelector('.marquee__row')
      const slowa = [...document.querySelectorAll('.marquee__word')].map((el) =>
        el.getBoundingClientRect(),
      )
      const kont = document.querySelector('#korzysci .container').getBoundingClientRect()
      return {
        kierunek: getComputedStyle(row).flexDirection,
        // Przy ukladzie pionowym dryf w bok wypychalby dolne slowo z kolumny.
        ruch: getComputedStyle(document.querySelector('.marquee__word--trail')).animationName,
        najdalejWLewo: Math.min(...slowa.map((b) => b.left)) - kont.left,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      }
    })

    expect(m.kierunek).toBe('column')
    expect(m.ruch).toBe('none')
    expect(m.najdalejWLewo).toBeGreaterThanOrEqual(0)
    expect(m.overflow).toBeLessThanOrEqual(1)
  })

  test('przy reduced motion pas stoi, romby sie nie krecą, tekst jest pelny', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'reduced-motion', 'wariant reduced motion')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await doSekcji(page)
    await page.waitForTimeout(400)

    const m = await page.evaluate(() => ({
      slowo: getComputedStyle(document.querySelector('.marquee__word--lead')).animationName,
      romb: getComputedStyle(document.querySelector('.marquee__sep')).animationName,
      przesuniecie: getComputedStyle(document.querySelector('.marquee__word--lead')).translate,
      obrot: getComputedStyle(document.querySelector('.marquee__sep')).rotate,
      krycie: [...document.querySelectorAll('.benefits__item')].map((el) =>
        Number(getComputedStyle(el).opacity),
      ),
    }))

    expect(m.slowo).toBe('none')
    expect(m.romb).toBe('none')
    expect(m.przesuniecie).toBe('none')
    expect(m.obrot).toBe('none')
    for (const o of m.krycie) expect(o).toBe(1)
  })
})

test.describe('nawigacja i dostepnosc', () => {
  test('kotwica z URL ustawia sekcje pod sticky headerem', async ({ page }) => {
    await page.goto('/#cennik')

    const { sectionTop, headerBottom } = await page.evaluate(() => ({
      sectionTop: document.getElementById('cennik').getBoundingClientRect().top,
      headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom,
    }))

    // Sekcja nie moze chowac sie pod naglowkiem po skoku z adresu.
    expect(sectionTop).toBeGreaterThanOrEqual(headerBottom - 2)
  })

  test('sticky header ma rozsadna wysokosc - brak sprzezenia zwrotnego pomiaru', async ({
    page,
  }) => {
    await page.goto('/')
    await page.waitForTimeout(600)

    const height = await page
      .locator('.site-header')
      .evaluate((el) => el.getBoundingClientRect().height)

    // Regresja: moduł nawigacji zapisywal wysokosc do zmiennej, ktora sama
    // ustalala wysokosc headera. Kazdy pomiar rosl o grubosc obramowania.
    expect(height).toBeLessThan(120)
  })

  test('FAQ dziala z klawiatury bez JavaScriptu', async ({ page }) => {
    await page.goto('/')

    const first = page.locator('.faq__item').first()
    const summary = first.locator('summary')

    await expect(first).not.toHaveAttribute('open', '')
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(first).toHaveAttribute('open', '')
  })

  test('odpowiedzi FAQ sa w DOM takze gdy sekcja jest zwinieta', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.faq__answer').first()).toContainText('klas 1-7')
  })

  test('skip link jest pierwszy w kolejnosci focusu', async ({ page }, testInfo) => {
    // WebKit mobilny nie przenosi focusu klawiszem Tab na linki bez wlaczenia
    // "Press Tab to highlight each item" - to zachowanie platformy, nie strony.
    test.skip(
      testInfo.project.name === 'mobile-safari',
      'Tab nie przenosi focusu na linki w mobilnym Safari',
    )

    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toHaveClass(/skip-link/)
  })

  test('krytyczne targety dotykowe maja minimum 44 px', async ({ page }) => {
    await page.goto('/')

    const small = await page.evaluate(() => {
      const out = []
      for (const el of document.querySelectorAll('.cta, .contact__row, .faq__question')) {
        const r = el.getBoundingClientRect()
        if (r.height > 0 && r.height < 44) out.push([el.className, Math.round(r.height)])
      }
      return out
    })

    expect(small).toEqual([])
  })
})

test.describe('responsywnosc', () => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    test(`brak poziomego scrolla przy ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow).toBeLessThanOrEqual(1)
    })
  }

  /*
   * Tekst hero lezy na pustej scianie w kadrze. Sciana konczy sie okolo 44%
   * szerokosci zdjecia, a napisy sa czarne - kazde ich wejscie na postac
   * to utrata kontrastu, wiec blad dostepnosci, nie tylko estetyki.
   *
   * Regresja, ktora ten test lapie, byla nieoczywista: kolumna byla najszersza
   * NIE przy najszerszym ekranie. Przy 1680 px lewy margines juz zniknal,
   * a szerokosc pola wciaz rosla z 52vw, wiec wiersz siegal 48% i wchodzil
   * na dziewczynke. Przy 1900 px ten sam kod trzymal sie w 42%.
   */
  for (const width of [1024, 1280, 1440, 1536, 1680, 1920, 2560]) {
    test(`tekst hero nie wchodzi na postacie przy ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 865 })
      await page.goto('/')

      const right = await page.evaluate(() => {
        const boxes = ['.hero__wordmark', '.hero__title', '.hero__lead'].flatMap((sel) => {
          const el = document.querySelector(sel)
          return el ? [...el.getClientRects()] : []
        })
        return Math.max(...boxes.map((b) => b.right))
      })

      // 41% szerokosci ekranu: 40vw z CSS plus punkt tolerancji na
      // zaokraglenia subpikselowe.
      expect(right).toBeLessThanOrEqual(width * 0.41)
    })
  }

  test('kazde zdanie naglowka hero stoi w jednej linii', async ({ page }) => {
    /*
     * Wymog wlasciciela: "Angielski po lekcjach." i "W tej samej szkole."
     * maja sie miescic w jednej linijce kazde, przy niezmienionym stopniu
     * pisma. Przy dwoch zdaniach i jawnym <br> oznacza to dokladnie 2 linie.
     */
    for (const width of [1024, 1280, 1440, 1680, 1920, 2560]) {
      await page.setViewportSize({ width, height: 865 })
      await page.goto('/')

      const lines = await page.evaluate(() => {
        const el = document.querySelector('.hero__title')
        const lh = parseFloat(getComputedStyle(el).lineHeight)
        return Math.round(el.getBoundingClientRect().height / lh)
      })
      expect(lines, `szerokosc ${width} px`).toBe(2)
    }
  })

  test('mobile ma wlasna choreografie, nie pomniejszony desktop (VIZ-004)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    /*
     * Poziome menu ustepuje miejsca szufladzie i jednemu sticky CTA.
     * Przycisk w naglowku wystepuje w dwoch wariantach - sprzedazowym
     * i rekrutacyjnym - wiec sprawdzamy wszystkie wystapienia.
     */
    await expect(page.locator('.site-nav')).toBeHidden()
    await expect(page.locator('.cta-dock')).toBeVisible()
    for (const cta of await page.locator('.site-header__cta').all()) {
      await expect(cta).toBeHidden()
    }

    // Nawigacja nie znika bez sladu: jej role przejmuje przelacznik szuflady.
    await expect(page.locator('.site-header__toggle')).toBeVisible()
    await expect(page.locator('.drawer')).toBeHidden()

    // Wordmark nie moze skurczyc sie do napisu - lamie sie i rosnie.
    const { size, lines } = await page.locator('.hero__wordmark').evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        size: parseFloat(s.fontSize),
        lines: Math.round(el.getBoundingClientRect().height / parseFloat(s.lineHeight)),
      }
    })

    expect(size).toBeGreaterThan(80)
    expect(lines).toBe(2)

    // Hero bierze kadr pionowy, nie przyciety poziomy.
    const ratio = await page
      .locator('.hero__media')
      .evaluate((el) => el.getBoundingClientRect().width / el.getBoundingClientRect().height)
    expect(ratio).toBeLessThan(1)
  })

  test('sticky media degraduje sie na malym ekranie (spec 30.1)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const position = await page
      .locator('.media--sticky')
      .evaluate((el) => getComputedStyle(el).position)
    expect(position).toBe('static')
  })
})

test.describe('motion', () => {
  test('reveal odslania tresc, a nie zostawia jej ukrytej (ANIM-003)', async ({ page }) => {
    await page.goto('/')

    /*
     * H1 swiadomie NIE ma reveal: jest kandydatem na element LCP, a start
     * od opacity 0 opoznialby jego pomiar. Musi byc widoczny od razu.
     */
    const h1 = page.locator('.hero__title')
    await expect(h1).not.toHaveAttribute('data-animation', /.*/)
    await expect(h1).toBeVisible()
    expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')

    /*
     * Tresc, ktora uzytkownik faktycznie widzi po wczytaniu, nie moze startowac
     * od stanu ukrytego. Prog 70% wysokosci ekranu jest celowy: sekcja wchodzaca
     * dolna krawiedzia na kilkanascie pikseli ma prawo czekac na swoj reveal -
     * to jest sens tego mechanizmu, a nie usterka.
     */
    const ukryteWWidoku = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-animation]')].filter((el) => {
          const r = el.getBoundingClientRect()
          return r.top < window.innerHeight * 0.7 && getComputedStyle(el).opacity === '0'
        }).length,
    )
    expect(ukryteWWidoku).toBe(0)

    // Element ponizej fold odslania sie po przewinieciu - tam reveal ma sens.
    const faqHead = page.locator('#faq-title')
    await expect(faqHead).toHaveAttribute('data-animation', /.+/)
    await faqHead.scrollIntoViewIfNeeded()
    await expect(faqHead).toHaveClass(/is-visible/)
    await expect
      .poll(async () => Number(await faqHead.evaluate((el) => getComputedStyle(el).opacity)), {
        timeout: 3000,
      })
      .toBeGreaterThan(0.95)
  })

  test('siatka bezpieczenstwa odslania wszystko, gdy obserwator milczy', async ({ page }) => {
    await page.goto('/')

    // Symulujemy cisze obserwatora: usuwamy klase, ktora go uruchomila,
    // i sprawdzamy, ze po zabezpieczeniu czasowym nic nie zostaje ukryte.
    await page.waitForTimeout(3000)

    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-animation]')].filter(
          (el) => !el.classList.contains('is-visible'),
        ).length,
    )
    expect(hidden).toBe(0)
  })

  test('bez JavaScriptu tresc jest widoczna od razu', async ({ browser }) => {
    // Klasa `js` na <html> jest warunkiem stanu poczatkowego reveal.
    // Bez niej - czyli przy awarii skryptu - tresc nie moze byc ukryta.
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/')

    await expect(page.locator('html')).not.toHaveClass(/js/)
    await expect(page.locator('.hero__title')).toBeVisible()
    expect(await page.locator('.hero__title').evaluate((el) => getComputedStyle(el).opacity)).toBe(
      '1',
    )
    /*
     * Droga kontaktu musi byc osiagalna bez JavaScriptu (D2). Numer w sekcji
     * kontaktu jest tekstem - decyzja wlasciciela - wiec KLIKALNY telefon
     * sprawdzamy tam, gdzie zostal: w stopce, obecnej na kazdej stronie.
     */
    await expect(page.locator('#kontakt')).toContainText('+48 790 266 517')
    await expect(page.locator('.site-footer a[href^="tel:"]')).toBeVisible()
    await expect(page.locator('.site-footer a[href^="mailto:"]')).toBeVisible()

    await context.close()
  })

  test('ruch wiazany ze scrollem jest progressive enhancement', async ({ page }, testInfo) => {
    // Przy reduced motion cala warstwa narrative jest wylaczona z zalozenia -
    // sprawdza to osobny test w bloku "reduced motion".
    test.skip(
      testInfo.project.name === 'reduced-motion',
      'Warstwa narrative jest wylaczona przy reduced motion',
    )

    await page.goto('/')

    const supported = await page.evaluate(() => CSS.supports('animation-timeline', 'view()'))
    const animation = await page
      .locator('.hero__wordmark')
      .evaluate((el) => getComputedStyle(el).animationName)

    // Tam gdzie przegladarka wspiera scroll-driven animations, wordmark ma momentum.
    // Tam gdzie nie - kompozycja jest statyczna i to jest poprawny stan.
    expect(supported ? animation : 'none').toBe(supported ? 'wordmark-drift' : 'none')
  })
})

test.describe('reduced motion', () => {
  test('reveal nie ukrywa tresci przy prefers-reduced-motion', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'reduced-motion',
      'Test dotyczy wylacznie projektu reduced-motion',
    )

    await page.goto('/')

    // Bez czekania na obserwatora: przy reduced motion stan poczatkowy nie istnieje.
    const opacity = await page.locator('#faq-title').evaluate((el) => getComputedStyle(el).opacity)
    expect(opacity).toBe('1')
  })

  test('ruch wiazany ze scrollem jest wylaczony przy reduced motion', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'reduced-motion',
      'Test dotyczy wylacznie projektu reduced-motion',
    )

    await page.goto('/')

    for (const selector of [
      '.hero__wordmark',
      '.marquee__word--lead',
      '.marquee__sep',
      '.method__verb',
    ]) {
      const name = await page
        .locator(selector)
        .first()
        .evaluate((el) => getComputedStyle(el).animationName)
      expect(name).toBe('none')
    }
  })

  test('przy prefers-reduced-motion scroll nie jest wygladzany', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'reduced-motion',
      'Test dotyczy wylacznie projektu reduced-motion',
    )

    await page.goto('/')

    const behavior = await page
      .locator('html')
      .evaluate((el) => getComputedStyle(el).scrollBehavior)
    expect(behavior).toBe('auto')

    const sticky = await page
      .locator('.media--sticky')
      .evaluate((el) => getComputedStyle(el).position)
    expect(sticky).toBe('static')
  })
})

test.describe('05 o high five', () => {
  test('sekcja niesie fakty przekazane przez wlasciciela', async ({ page }) => {
    await page.goto('/')
    const sekcja = page.locator('#o-nas')

    await expect(sekcja.locator('h2')).toHaveText('Lokalna szkoła. Dużo uwagi.')

    /*
     * Nazwisko, uczelnie i dlugosc doswiadczenia pochodza WPROST od
     * wlasciciela. Bez tego par. 4 zabranialby publikowania kwalifikacji
     * osob uczacych.
     */
    await expect(sekcja).toContainText('Magdalenę Germel')
    await expect(sekcja).toContainText('Uniwersytecie Warszawskim')
    await expect(sekcja).toContainText('SWPS')
    /*
     * s+ zamiast spacji: toContainText normalizuje biale znaki tylko dla
     * lancuchow. Wyrazenie regularne dostaje surowy tekst razem z lamaniem
     * wierszy ze zrodla, wiec sztywna spacja nie trafialaby w zdanie
     * rozbite miedzy dwie linie HTML.
     */
    await expect(sekcja).toContainText(/od\s+ponad\s+20\s+lat/i)
    await expect(sekcja).toContainText(/w\s+szkole\s+podstawowej/i)
    /*
     * Szyk odwrocony przez wlasciciela 18.09.2026 razem z przepisaniem calej
     * sekcji: "dyplomowana nauczycielka", nie "nauczycielka dyplomowana".
     * Kwalifikacja ma stac w tekscie - kolejnosc slow jest jego decyzja.
     */
    await expect(sekcja).toContainText(/dyplomowaną\s+nauczycielką/i)
    await expect(sekcja).toContainText(/Okręgowej\s+Komisji\s+Egzaminacyjnej/i)

    /*
     * "Male grupy" zeszlo z paska faktow, bo miejsce dostaly mocniejsze
     * kwalifikacje - ale NIE moze zniknac z komunikacji. Zostaje wprost
     * w trzecim akapicie.
     */
    await expect(sekcja).toContainText(/małe\s+grupy/i)

    const wyrozniki = await sekcja.locator('.about__mark strong').allTextContents()
    expect(wyrozniki.map((t) => t.trim())).toEqual(['20+', 'UW + SWPS', 'Dyplomowana', 'OKE'])
  })

  test('pasek faktow nie przycina najdluzszego hasla', async ({ page }) => {
    await page.goto('/')

    /*
     * "Dyplomowana" to jedenascie znakow bez miejsca na zlamanie. Przy zbyt
     * duzym stopniu pisma wychodzila poza swoja kolumne i byla przycinana -
     * test porownuje szerokosc tresci z szerokoscia pola.
     */
    const przepelnione = await page.evaluate(() =>
      [...document.querySelectorAll('.about__mark strong')]
        .filter((el) => el.scrollWidth > el.clientWidth + 1)
        .map((el) => el.textContent.trim()),
    )
    expect(przepelnione).toEqual([])
  })

  test('portret trzyma te sama prawa os co pozostale duze zdjecia', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'uklad dwukolumnowy')

    /*
     * Hero, kadr sekcji 02 i kadr senioralny koncza sie na krawedzi okna.
     * Portret konczyl sie 147 px wczesniej i prawa strona strony nie miala
     * wspolnej linii.
     */
    for (const width of [1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const m = await page.evaluate(() => ({
        portret: Math.round(document.querySelector('.about__media').getBoundingClientRect().right),
        hero: Math.round(document.querySelector('.hero__media').getBoundingClientRect().right),
        udzial:
          document.querySelector('.about__media').getBoundingClientRect().width / window.innerWidth,
      }))

      expect(m.portret, width + ' px').toBe(m.hero)

      /*
       * Udzial kadru NIE jest juz staly. Jego szerokosc wynika z wysokosci,
       * a ta rowna sie wysokosci kolumny tekstowej - przy wezszym oknie tekst
       * lamie sie na wiecej wierszy i kadr rosnie, dopoki nie zatrzyma go
       * limit czterech pol siatki. Widelki opisuja wiec caly ten zakres,
       * a nie jedna wartosc. Pilnujemy dwoch rzeczy: kadr zostaje duzym
       * elementem kompozycji i nie wchodzi na kolumne tekstowa.
       */
      expect(m.udzial, width + ' px').toBeGreaterThan(0.2)
      expect(m.udzial, width + ' px').toBeLessThan(0.45)

      const nachodzi = await page.evaluate(() => {
        const kadr = document.querySelector('.about__media').getBoundingClientRect()
        const tekst = document.querySelector('.about__text').getBoundingClientRect()
        return Math.round(tekst.right - kadr.left)
      })
      expect(nachodzi, width + ' px - kadr na tekscie').toBeLessThanOrEqual(0)
    }
  })

  test('portret jest prawdziwym zdjeciem, nie zastepnikiem', async ({ page }) => {
    await page.goto('/')

    // Slot na brakujacy kadr zniknal - zdjecie zostalo dostarczone.
    await expect(page.locator('#o-nas .photo-todo')).toHaveCount(0)

    const img = page.locator('#o-nas img')
    await expect(img).toHaveAttribute('src', /about-magdalena-germel/)
    await expect(img).toHaveAttribute('alt', /Magdalena Germel/)

    // Wymiary w atrybutach rezerwuja miejsce, wiec obraz nie przesuwa layoutu.
    await expect(img).toHaveAttribute('width', '1122')
    await expect(img).toHaveAttribute('height', '1402')
    await expect(img).toHaveAttribute('loading', 'lazy')

    // Pelna proporcja zrodla - kwadratowy kadr obcinal biurko i notatnik.
    const proporcja = await page.evaluate(() => {
      const box = document.querySelector('#o-nas .about__media').getBoundingClientRect()
      return +(box.width / box.height).toFixed(2)
    })
    expect(proporcja).toBeCloseTo(0.8, 1)
  })

  test('menu O High Five prowadzi do tej sekcji, nie do metody', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'menu poziome od 75rem')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    const pozycja = page.locator('.site-nav__link[data-nav="o-nas"]')
    await expect(pozycja).toHaveAttribute('href', '/#o-nas')

    await pozycja.click()
    await page.waitForTimeout(600)

    // Sekcja stoi pod sticky naglowkiem, a nie pod nim schowana.
    const m = await page.evaluate(() => ({
      gora: document.querySelector('#o-nas').getBoundingClientRect().top,
      dolNaglowka: document.querySelector('.site-header').getBoundingClientRect().bottom,
    }))
    expect(m.gora).toBeGreaterThanOrEqual(m.dolNaglowka - 2)
  })

  test('wyrozniki nie lamia sie na telefonie i nie powoduja scrolla', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-safari', 'uklad mobilny')

    await page.goto('/')
    const m = await page.evaluate(() => {
      const sekcja = document.querySelector('#o-nas')
      return {
        marks: sekcja.querySelectorAll('.about__mark').length,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      }
    })

    expect(m.marks).toBe(4)
    expect(m.overflow).toBeLessThanOrEqual(1)
  })
})

test.describe('05 o high five - kotwica i wejscie faktow', () => {
  /** Czeka az plynne przewijanie faktycznie sie zatrzyma. */
  async function poczekajNaKoniecScrolla(page) {
    await page.evaluate(
      () =>
        new Promise((res) => {
          let ostatni = -1
          let stabilne = 0
          const tik = () => {
            const y = Math.round(window.scrollY)
            stabilne = y === ostatni ? stabilne + 1 : 0
            ostatni = y
            if (stabilne > 8) res()
            else requestAnimationFrame(tik)
          }
          requestAnimationFrame(tik)
        }),
    )
  }

  async function odstepPodNaglowkiem(page) {
    return page.evaluate(() => {
      const eyebrow = document.querySelector('#o-nas .section__label')
      const naglowek = document.querySelector('.site-header').getBoundingClientRect()
      return Math.round(eyebrow.getBoundingClientRect().top - naglowek.bottom)
    })
  }

  test('klik w menu zatrzymuje etykiete tuz pod naglowkiem', async ({ page }) => {
    /*
     * Regresja, ktora ten test lapie: nad etykieta stalo 88 px pustki, bo
     * skladaly sie na nia DWIE niezalezne wartosci - scroll-margin sekcji
     * oraz jej wlasny padding-block-start. Teraz scroll-margin odejmuje
     * padding, wiec suma jest stala niezaleznie od obu.
     */
    for (const width of [1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await page.waitForTimeout(400)

      await page.evaluate(() => document.querySelector('[data-nav="o-nas"]').click())
      await poczekajNaKoniecScrolla(page)

      /*
       * Widelki zeszly z 24-40 px na 12-28 px razem z --space-about-anchor.
       * Wlasciciel poprosil o podciagniecie sekcji po skoku z menu, zeby
       * pasek faktow u jej dolu wchodzil w ekran w calosci.
       */
      const odstep = await odstepPodNaglowkiem(page)
      expect(odstep, width + ' px').toBeGreaterThanOrEqual(12)
      expect(odstep, width + ' px').toBeLessThanOrEqual(28)
    }
  })

  test('wejscie bezposrednio z adresem i odswiezenie daja to samo', async ({ page }) => {
    for (const width of [390, 1024, 1440]) {
      await page.setViewportSize({ width, height: 844 })

      /*
       * Kolejnosc jest istotna. Samo goto na ten sam adres z hashem jest
       * nawigacja W OBREBIE dokumentu - skrypty sie nie wykonuja, a poprzednia
       * pozycja przewijania zostaje. Dopiero reload daje pelne wczytanie
       * z hashem, czyli to, co robi uzytkownik wklejajacy adres.
       */
      await page.goto('/')
      await page.goto('/#o-nas')
      await page.reload()
      await poczekajNaKoniecScrolla(page)
      const pierwsze = await odstepPodNaglowkiem(page)

      // Odswiezenie z tym samym hashem - bez drugiego skoku po zaladowaniu.
      await page.reload()
      await poczekajNaKoniecScrolla(page)
      const poOdswiezeniu = await odstepPodNaglowkiem(page)

      // Te same widelki co przy skoku z menu - patrz --space-about-anchor.
      expect(pierwsze, width + ' px').toBeGreaterThanOrEqual(12)
      expect(pierwsze, width + ' px').toBeLessThanOrEqual(28)
      /*
       * Tolerancja dwoch pikseli, nie rownosc co do jednego. WebKit zaokragla
       * pozycje po przeladowaniu inaczej niz Chromium i roznica jednego
       * piksela nie znaczy tu nic - chodzi o to, ze odswiezenie NIE wykonuje
       * drugiego skoku i nie ladowalo kilkaset pikseli obok.
       */
      expect(Math.abs(poOdswiezeniu - pierwsze), width + ' px po odswiezeniu').toBeLessThanOrEqual(
        2,
      )
    }
  })

  test('po skoku widac naglowek i caly opis, nie sam tytul', async ({ page }) => {
    for (const width of [1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/#o-nas')
      await poczekajNaKoniecScrolla(page)
      await page.waitForTimeout(1400)

      const m = await page.evaluate(() => {
        const sek = document.querySelector('#o-nas')
        const wKadrze = (el) => el.getBoundingClientRect().bottom <= window.innerHeight
        const akapity = [...sek.querySelectorAll('.about__text > p[data-animation]')]
        return {
          h2: wKadrze(sek.querySelector('h2')),
          akapity: akapity.filter(wKadrze).length,
          wszystkie: akapity.length,
        }
      })

      expect(m.h2, width + ' px').toBe(true)
      expect(m.akapity, width + ' px: akapity w kadrze').toBe(m.wszystkie)
    }
  })

  test('cztery fakty wchodza po kolei, nie naraz', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'reduced-motion', 'wariant bez ruchu ma wlasny test')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/#o-nas')
    await page.waitForTimeout(2200)

    const m = await page.evaluate(() =>
      [...document.querySelectorAll('#o-nas .about__mark')].map((el) => {
        const cs = getComputedStyle(el)
        const ms = (v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000)
        return {
          opoznienie: ms(cs.transitionDelay.split(',')[0]),
          czas: ms(cs.transitionDuration.split(',')[0]),
          odsloniety: el.classList.contains('is-visible'),
        }
      }),
    )

    expect(m).toHaveLength(4)

    // Stagger rosnie, krok miesci sie w widelkach 120-160 ms.
    for (let i = 1; i < m.length; i += 1) {
      const krok = m[i].opoznienie - m[i - 1].opoznienie
      expect(krok, 'krok ' + i).toBeGreaterThanOrEqual(120)
      expect(krok, 'krok ' + i).toBeLessThanOrEqual(160)
    }

    // Czas trwania spokojny, w widelkach 650-800 ms.
    expect(m[0].czas).toBeGreaterThanOrEqual(650)
    expect(m[0].czas).toBeLessThanOrEqual(800)

    // Po odslonieciu zostaja widoczne - obserwator odlacza element.
    for (const f of m) expect(f.odsloniety).toBe(true)
  })

  test('ruch faktow jest maly i bez skalowania', async ({ page }, testInfo) => {
    /*
     * Pomiar STANU POCZATKOWEGO, wiec tylko tam, gdzie da sie go zlapac.
     *
     * Na WebKicie element ponizej zagiecia raportuje juz `opacity: 1`
     * i `translate: 0px` w momencie odczytu - stan sprzed odslonienia
     * jest tam nieobserwowalny z poziomu testu i asercja padala raz na
     * kilka uruchomien. Tresc nie jest tam ukryta, wiec to nie jest usterka
     * dostepnosci; nieobserwowalny jest sam moment przed animacja.
     *
     * Gwarancje, ktore ten test naprawde niesie - brak scale, brak obrotu,
     * mala amplituda - sa niezalezne od silnika i sprawdzamy je w Chromium.
     * Wariant bez ruchu ma osobny test w projekcie reduced-motion.
     */
    test.skip(testInfo.project.name !== 'desktop-chromium', 'stan poczatkowy mierzalny w Chromium')

    await page.goto('/')

    /*
     * Stan poczatkowy zyje pod klasa dodawana przez skrypt. Odczyt tuz po
     * zaladowaniu trafialby czasem przed nia i widzial element bez ruchu.
     */
    await page.waitForFunction(() => document.documentElement.classList.contains('js'))

    /*
     * Stan poczatkowy odtwarzamy jawnie, zamiast liczyc na to, ze element
     * jeszcze go nie opuscil. Siatka bezpieczenstwa odslania cala strone
     * po 2500 ms od zaladowania, a na wolniejszym silniku sam start testu
     * potrafi przekroczyc ten prog - odczyt trafial wtedy w stan koncowy.
     */
    /*
     * Zdjecie klasy i odczyt w JEDNYM evaluate.
     *
     * Wczesniej byly to trzy osobne kroki i miedzy nie wchodzil obserwator
     * albo siatka bezpieczenstwa: element wracal do stanu koncowego, a test
     * czytal `translate: 0px`. WebKit serializuje ten stan inaczej niz
     * Chromium - jako `0px`, nie `none` - wiec warunek "nie none" byl
     * spelniony i test padal raz na kilka uruchomien.
     *
     * Wszystko w jednym bloku synchronicznym: callback obserwatora to
     * osobne zadanie i nie ma sie gdzie wcisnac.
     */
    const m = await page.evaluate(() => {
      const el = document.querySelector('#o-nas .about__mark')
      el.classList.remove('is-visible')
      const cs = getComputedStyle(el)
      return { translate: cs.translate, scale: cs.scale, rotate: cs.rotate }
    })

    expect(m.translate).not.toBe('none')

    // Tylko przesuniecie w pionie - bez scale, bez obrotu.
    expect(m.scale).toBe('none')
    expect(m.rotate).toBe('none')

    /*
     * Odczyt przez wyrazenie, nie przez podzial po spacji: WebKit serializuje
     * `translate` inaczej niz Chromium i przy zerowej skladowej poziomej
     * potrafi zwrocic sama wartosc pionowa. Bierzemy ostatnia liczbe,
     * czyli przesuniecie w pionie w obu zapisach.
     */
    const liczby = m.translate.match(/-?\d+(?:\.\d+)?/g) ?? []
    const px = Number(liczby.at(-1) ?? 0)

    expect(px).toBeGreaterThan(0)
    expect(px).toBeLessThanOrEqual(16)
  })

  test('przy reduced motion fakty sa widoczne od razu', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'reduced-motion', 'wariant reduced motion')

    await page.goto('/#o-nas')
    await page.waitForTimeout(400)

    const m = await page.evaluate(() =>
      [...document.querySelectorAll('#o-nas .about__mark')].map((el) => {
        const cs = getComputedStyle(el)
        return { opacity: Number(cs.opacity), translate: cs.translate }
      }),
    )

    expect(m).toHaveLength(4)
    for (const f of m) {
      expect(f.opacity).toBe(1)
      expect(f.translate).toBe('none')
    }
  })
})
