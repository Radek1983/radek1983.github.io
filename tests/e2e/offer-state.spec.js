import { expect, test } from '@playwright/test'

/**
 * Wspolny jezyk interakcji kolumny oferty.
 *
 * Trzy sygnaly sa wspolne dla mega-menu i sekcji 04 w body: czerwona kreska
 * nad modulem, czerwony numer, ruch strzalki. Czwarty - marker pod naglowkiem
 * - istnieje WYLACZNIE w mega-menu. Tej asymetrii pilnuja testy ponizej, bo
 * bez niej sekcja contentowa zaczyna wygladac jak drugie menu.
 */

const SIGNAL = 'rgb(242, 59, 47)'

/*
 * Kreska i marker chowaja sie przez `scale: 0 1`, a rozwijaja do `scale: 1 1`.
 *
 * Czytamy WLASNOSC `scale`, nie `transform`. Projekt uzywa indywidualnych
 * wlasnosci transformacji, a te nie skladaja sie w `transform` - ten zostaje
 * `none` i test mierzylby zawsze to samo, niezaleznie od stanu.
 */
const skalaX = (el, pseudo) =>
  el.evaluate((node, p) => {
    const s = getComputedStyle(node, p).scale
    return s === 'none' ? 1 : Number(s.split(' ')[0])
  }, pseudo)

const kolor = (el) => el.evaluate((n) => getComputedStyle(n).color)

/*
 * Kreska rozwija sie przez --dur-state (240 ms). Odczyt bezposrednio po
 * hover lapie ja w polowie drogi - stad jawne odczekanie zamiast liczenia
 * na to, ze test zdazy sie wykonac wolniej niz animacja.
 */
const poPrzejsciu = (page) => page.waitForTimeout(400)

/*
 * Geometria mierzona wzgledem DOKUMENTU, nie okna. `hover()` przewija
 * element do widoku, wiec getBoundingClientRect() zmienia sie nawet wtedy,
 * gdy layout stoi nieruchomo - i test krzyczalby o przesuniecie, ktorego
 * nie ma.
 */
const geometria = (locator) =>
  locator.evaluateAll((els) =>
    els.map((el) => [el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight].join(':')),
  )

/*
 * Wejscie z KLAWIATURY, nie programowy focus(). :focus-visible wlacza sie
 * tylko wtedy, gdy ostatnia interakcja byla klawiaturowa - a wlasnie ten
 * przypadek testujemy.
 */
const tabDoPierwszejOferty = async (page) => {
  await page.locator('.site-nav__trigger[data-nav="oferta"]').focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Tab')
  await page.waitForTimeout(300)
}

test.describe('stan kolumny oferty - mega-menu', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'menu poziome dziala od 75rem')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await page.locator('.site-nav__trigger[data-nav="oferta"]').click()
    await expect(page.locator('.mega')).toBeVisible()
  })

  test('w spoczynku zadna kolumna nie wyglada na aktywna', async ({ page }) => {
    for (const link of await page.locator('.mega__link').all()) {
      expect(await skalaX(link, '::before')).toBe(0)
      expect(await skalaX(link.locator('.mega__label'), '::after')).toBe(0)
      expect(await kolor(link.locator('.mega__number'))).not.toBe(SIGNAL)
    }
  })

  test('kazda z czterech kolumn zapala sie osobno', async ({ page }) => {
    const linki = await page.locator('.mega__link').all()
    expect(linki).toHaveLength(4)

    for (const [i, link] of linki.entries()) {
      await link.hover()
      await poPrzejsciu(page)

      expect(await skalaX(link, '::before'), `kreska nad kolumna ${i + 1}`).toBe(1)
      await expect(link.locator('.mega__number')).toHaveCSS('color', SIGNAL)
      expect(await skalaX(link.locator('.mega__label'), '::after'), `marker ${i + 1}`).toBe(1)

      // Naglowek zostaje czarny - czerwienieje numer, nie cala kolumna.
      expect(await kolor(link.locator('.mega__label'))).not.toBe(SIGNAL)

      // Pozostale trzy gasna - hover nie zostawia sladu po poprzedniej pozycji.
      for (const [j, inny] of linki.entries()) {
        if (j !== i) expect(await skalaX(inny, '::before'), `kolumna ${j + 1} po ${i + 1}`).toBe(0)
      }
    }
  })

  test('focus klawiatury daje ten sam stan co najechanie', async ({ page }, testInfo) => {
    // Panel jest juz otwarty klknieciem z beforeEach - Enter by go zamknal.
    await page.keyboard.press('Escape')
    await tabDoPierwszejOferty(page)
    await poPrzejsciu(page)

    const link = page.locator('.mega__link').first()
    expect(await skalaX(link, '::before')).toBe(1)
    expect(await skalaX(link.locator('.mega__label'), '::after')).toBe(1)
    await expect(link.locator('.mega__number')).toHaveCSS('color', SIGNAL)
    /*
     * Przy prefers-reduced-motion strzalka CELOWO stoi w miejscu - kolor
     * i kreska przelaczaja sie natychmiast, znika sam ruch.
     */
    const strzalka = link.locator('.offer-mark__arrow')
    if (testInfo.project.name === 'reduced-motion') {
      await expect(strzalka).toHaveCSS('translate', 'none')
    } else {
      await expect(strzalka).not.toHaveCSS('translate', 'none')
    }
  })

  test('hover nie przesuwa layoutu', async ({ page }) => {
    const kolumny = page.locator('.mega__item')

    const przed = await geometria(kolumny)
    await page.locator('.mega__link').nth(2).hover()
    await poPrzejsciu(page)

    expect(await geometria(kolumny)).toEqual(przed)
  })
})

test.describe('stan kolumny oferty - biezaca podstrona', () => {
  test.beforeEach(({ page }, testInfo) => {
    void page
    test.skip(testInfo.project.name !== 'desktop-chromium', 'menu poziome dziala od 75rem')
  })

  const PRODUKTY = [
    ['/oferta/dzieci/', 0],
    ['/oferta/egzamin-osmoklasisty/', 1],
    ['/oferta/seniorzy/', 2],
    ['/oferta/online/', 3],
  ]

  for (const [url, indeks] of PRODUKTY) {
    test(`kolumna ${indeks + 1} jest aktywna na ${url} bez hovera`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(url)
      await page.locator('.site-nav__trigger[data-nav="oferta"]').click()

      const aktywne = page.locator('.mega__link[aria-current="page"]')
      await expect(aktywne).toHaveCount(1)
      await expect(page.locator('.mega__link').nth(indeks)).toHaveAttribute('aria-current', 'page')

      expect(await skalaX(aktywne, '::before')).toBe(1)
      expect(await skalaX(aktywne.locator('.mega__label'), '::after')).toBe(1)
      await expect(aktywne.locator('.mega__number')).toHaveCSS('color', SIGNAL)
    })
  }

  test('hub oferty i strony pomocnicze nie wskazuja zadnego produktu', async ({ page }) => {
    for (const url of ['/', '/oferta/', '/cennik/', '/lokalizacje/', '/kariera/']) {
      await page.goto(url)
      await expect(page.locator('.mega__link[aria-current="page"]'), url).toHaveCount(0)
    }
  })
})

/*
 * Sekcja wjezdza animacja reveal. Dopoki ta trwa, moduly przesuwaja sie
 * w pionie i kursor ustawiony przez hover() laduje obok kolumny, w ktora
 * mial trafic - stan gasl, a test raz przechodzil, raz nie. Stad jawne
 * przewiniecie i odczekanie przed kazdym pomiarem.
 */
const ustawSekcjeOferty = async (page) => {
  await page.locator('#oferta').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)
}

test.describe('stan kolumny oferty - sekcja 04 w body', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    await ustawSekcjeOferty(page)
  })

  test('cztery oferty prowadza pod wlasne adresy cala powierzchnia', async ({ page }) => {
    const oczekiwane = [
      '/oferta/dzieci/',
      '/oferta/egzamin-osmoklasisty/',
      '/oferta/seniorzy/',
      '/oferta/online/',
    ]

    const linki = page.locator('.paths__link')
    await expect(linki).toHaveCount(4)

    for (const [i, href] of oczekiwane.entries()) {
      await expect(linki.nth(i)).toHaveAttribute('href', href)

      // Link musi obejmowac caly modul, a nie samo wezwanie na koncu.
      const modul = await page.locator('.paths__item').nth(i).boundingBox()
      const link = await linki.nth(i).boundingBox()
      expect(Math.round(link.width)).toBe(Math.round(modul.width))
      expect(link.height).toBeGreaterThan(modul.height * 0.9)
    }
  })

  test('hover zapala kreske i numer, ale NIE dodaje markera', async ({ page }) => {
    const linki = await page.locator('.paths__link').all()

    for (const [i, link] of linki.entries()) {
      await link.hover()
      await poPrzejsciu(page)

      expect(await skalaX(link, '::before'), `kreska nad oferta ${i + 1}`).toBe(1)
      await expect(link.locator('.paths__number')).toHaveCSS('color', SIGNAL)

      /*
       * Sedno roznicy miedzy menu a trescia: pod naglowkiem w body nie moze
       * pojawic sie zadna kreska. Gdyby ktos skopiowal tu regule z mega-menu,
       * sekcja zaczelaby udawac drugie menu.
       */
      const marker = await link
        .locator('.paths__title')
        .evaluate((n) => getComputedStyle(n, '::after').content)
      expect(marker, `marker pod naglowkiem oferty ${i + 1}`).toBe('none')

      expect(await kolor(link.locator('.paths__title'))).not.toBe(SIGNAL)
    }
  })

  test('focus klawiatury daje ten sam stan co najechanie', async ({ page }, testInfo) => {
    /*
     * WebKit domyslnie nie zatrzymuje Taba na linkach (ustawienie systemowe
     * "Tab highlights each item"), wiec petla ponizej nigdy by do nich nie
     * doszla. Sam stan focusu jest ten sam we wszystkich silnikach.
     */
    test.skip(testInfo.project.name === 'mobile-safari', 'WebKit pomija linki przy Tab')

    const link = page.locator('.paths__link').first()

    // Tab az do pierwszej oferty - wejscie klawiatura, zeby zadzialal :focus-visible.
    await page.locator('.skip-link').focus()
    for (let i = 0; i < 40; i += 1) {
      if (await link.evaluate((n) => n === document.activeElement)) break
      await page.keyboard.press('Tab')
    }
    expect(await link.evaluate((n) => n === document.activeElement)).toBe(true)
    await poPrzejsciu(page)

    expect(await skalaX(link, '::before')).toBe(1)
    await expect(link.locator('.paths__number')).toHaveCSS('color', SIGNAL)
    /*
     * Przy prefers-reduced-motion strzalka CELOWO stoi w miejscu - kolor
     * i kreska przelaczaja sie natychmiast, znika sam ruch.
     */
    const strzalka = link.locator('.offer-mark__arrow')
    if (testInfo.project.name === 'reduced-motion') {
      await expect(strzalka).toHaveCSS('translate', 'none')
    } else {
      await expect(strzalka).not.toHaveCSS('translate', 'none')
    }
  })

  /*
   * Kreska i marker sa pozycjonowane bezwzglednie, a strzalka rusza sie przez
   * `translate` - zaden z tych mechanizmow nie moze ruszyc przeplywu. Test
   * mierzy to na kazdej szerokosci z macierzy, bo o layout shift najlatwiej
   * tam, gdzie kolumny wlasnie sie przelamuja.
   */
  for (const width of [390, 1024, 1280, 1440, 1920]) {
    test(`hover nie przesuwa layoutu przy ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await ustawSekcjeOferty(page)

      const oferty = page.locator('.paths__item')
      const przed = await geometria(oferty)

      for (const i of [0, 1, 2, 3]) {
        await page.locator('.paths__link').nth(i).hover()
        await poPrzejsciu(page)

        expect(await geometria(oferty), `po najechaniu na oferte ${i + 1}`).toEqual(przed)
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
          `poziome przewijanie po ofercie ${i + 1}`,
        ).toBe(true)
      }
    })
  }

  test('dolne odnosniki nie dostaja jezyka kolumn', async ({ page }) => {
    const wiecej = page.locator('#oferta .mega__more .u-link')
    await expect(wiecej).toHaveCount(2)

    for (const link of await wiecej.all()) {
      await expect(link).not.toHaveClass(/offer-mark/)
      await link.hover()
      await poPrzejsciu(page)

      // Zaden z nich nie dostaje czerwonej kreski nad soba - zostaje underline.
      const nadLinkiem = await link.evaluate((n) => getComputedStyle(n, '::before').backgroundColor)
      expect(nadLinkiem).not.toBe(SIGNAL)
    }
  })
})
