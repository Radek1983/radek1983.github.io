import { expect, test } from '@playwright/test'

/**
 * Mega-menu w dwóch motywach.
 *
 * Na stronie kariery nagłówek jest ciemny. Wcześniej nadpisywał kolor tekstu
 * na kremowy dla całego nagłówka, a panel mega-menu zachowywał kremowe tło:
 * etykiety i opisy były renderowane, tylko w kolorze identycznym z tłem.
 * Widać było wyłącznie numery, bo te liczą swój kolor z `--color-text`.
 *
 * Teraz motyw niesie `data-theme="ink"` na samym nagłówku, a komponenty biorą
 * kolory z ról semantycznych. Testy pilnują, że zmieniły się WYŁĄCZNIE kolory:
 * treść, układ i wymiary muszą być identyczne na obu stronach.
 */

const PAPER = 'rgb(242, 239, 232)'
const INK = 'rgb(10, 10, 10)'
const SIGNAL = 'rgb(242, 59, 47)'

const otworz = async (page, url) => {
  await page.goto(url)
  await page.evaluate(() => document.fonts.ready)
  await page.locator('.site-nav__trigger[data-nav="oferta"]').click()
  await expect(page.locator('.mega')).toBeVisible()
}

/** Pełna treść panelu, kolumna po kolumnie. */
const tresc = (page) =>
  page.evaluate(() => ({
    kolumny: [...document.querySelectorAll('.mega__item')].map((li) => ({
      numer: li.querySelector('.mega__number').textContent.trim(),
      etykieta: li.querySelector('.mega__label').textContent.trim(),
      opis: li.querySelector('.mega__desc').textContent.trim(),
      meta: li.querySelector('.mega__meta').textContent.trim(),
      cta: li.querySelector('.mega__cta').textContent.trim().replace(/\s+/g, ' '),
      href: li.querySelector('.mega__link').getAttribute('href'),
    })),
    // Selektor musi byc zakotwiczony w panelu: .mega__more niesie takze
    // sekcja 04 na stronie glownej i bez tego doliczylaby swoje dwa linki.
    dolne: [...document.querySelectorAll('.mega .mega__more a')].map((a) =>
      a.textContent.trim().replace(/\s+/g, ' '),
    ),
  }))

/** Geometria panelu - wymiary i pozycje kolumn względem panelu. */
const geometria = (page) =>
  page.evaluate(() => {
    const panel = document.querySelector('.mega')
    const p = panel.getBoundingClientRect()
    return {
      wysokosc: Math.round(p.height),
      szerokosc: Math.round(p.width),
      kolumny: [...document.querySelectorAll('.mega__item')].map((li) => {
        const r = li.getBoundingClientRect()
        return [Math.round(r.x - p.x), Math.round(r.width), Math.round(r.height)].join(':')
      }),
    }
  })

test.describe('mega-menu: motyw jasny i ciemny', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'menu poziome dziala od 75rem')
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  test('treść jest identyczna na stronie głównej i na karierze', async ({ page }) => {
    await otworz(page, '/')
    const home = await tresc(page)

    await otworz(page, '/kariera/')
    const kariera = await tresc(page)

    expect(kariera).toEqual(home)

    // I zgadza sie z tym, co ma stac w panelu.
    expect(home.kolumny.map((k) => `${k.numer} ${k.etykieta}`)).toEqual([
      '01 Klasy 1-7',
      '02 Klasa 8',
      '03 Dla seniorów',
      '04 Online 1 na 1',
    ])
    expect(home.dolne).toEqual(['Zobacz całą ofertę →', 'Cennik →'])
  })

  test('układ i wymiary są identyczne na obu stronach', async ({ page }) => {
    await otworz(page, '/')
    const home = await geometria(page)

    await otworz(page, '/kariera/')
    const kariera = await geometria(page)

    expect(kariera).toEqual(home)
  })

  /*
   * Sedno usterki: tlo panelu i kolor etykiety byly tym samym kolorem.
   */
  test('na karierze etykiety nie znikaja w tle', async ({ page }) => {
    await otworz(page, '/kariera/')

    const k = await page.evaluate(() => {
      const cs = (s, p) => getComputedStyle(document.querySelector(s))[p]
      return {
        tlo: cs('.mega', 'backgroundColor'),
        etykieta: cs('.mega__label', 'color'),
        cta: cs('.mega__cta', 'color'),
      }
    })

    expect(k.tlo).toBe(INK)
    expect(k.etykieta).toBe(PAPER)
    expect(k.etykieta, 'tekst w kolorze tla').not.toBe(k.tlo)
    expect(k.cta).toBe(SIGNAL)

    // Kazda etykieta, opis i wezwanie musza byc realnie widoczne.
    for (const sel of ['.mega__label', '.mega__desc', '.mega__meta', '.mega__cta']) {
      const el = page.locator(sel).first()
      await expect(el).toBeVisible()
      await expect(el).not.toHaveText('')
    }
  })

  test('strona główna zostaje w motywie jasnym', async ({ page }) => {
    await otworz(page, '/')

    await expect(page.locator('.mega')).toHaveCSS('background-color', PAPER)
    await expect(page.locator('.mega__label').first()).toHaveCSS('color', INK)
    await expect(page.locator('.mega__cta').first()).toHaveCSS('color', SIGNAL)
  })

  /*
   * Motyw jest wariantem WSPOLNEGO komponentu, nie druga implementacja.
   * Atrybut siedzi na naglowku i jest podstawiany przy budowaniu.
   */
  test('motyw jest atrybutem nagłówka, a nie osobnym menu', async ({ page }) => {
    await page.goto('/kariera/')
    await expect(page.locator('header.site-header')).toHaveAttribute('data-theme', 'ink')
    await expect(page.locator('.mega')).toHaveCount(1)

    await page.goto('/')
    await expect(page.locator('header.site-header')).not.toHaveAttribute('data-theme', /.+/)
    await expect(page.locator('.mega')).toHaveCount(1)
  })

  test('hover dziala tak samo jak na stronie głównej', async ({ page }) => {
    const zmierz = async (url) => {
      await otworz(page, url)
      const link = page.locator('.mega__link').first()
      await link.hover()
      await page.waitForTimeout(400)
      return page.evaluate(() => {
        const link = document.querySelector('.mega__link')
        const cs = (el, p, pseudo) => getComputedStyle(el, pseudo)[p]
        return {
          kreska: cs(link, 'scale', '::before'),
          marker: cs(link.querySelector('.mega__label'), 'scale', '::after'),
          strzalka: cs(link.querySelector('.offer-mark__arrow'), 'translate'),
          numer: cs(link.querySelector('.mega__number'), 'color'),
        }
      })
    }

    const home = await zmierz('/')
    const kariera = await zmierz('/kariera/')

    // Ruch i czerwien numeru - identyczne. Kolory reszty niesie motyw.
    expect(kariera).toEqual(home)
    expect(kariera.numer).toBe(SIGNAL)
    expect(kariera.strzalka).toBe('7px')
  })

  /*
   * KARIERA to biezaca trasa, OFERTA to otwarty panel. Uzytkownik nie moze
   * odniesc wrazenia, ze stoi jednoczesnie na dwoch stronach.
   */
  test('kariera zostaje aktywną trasą, a CTA nagłówka się nie zmienia', async ({ page }) => {
    await otworz(page, '/kariera/')

    const s = await page.evaluate(() => {
      const podkreslenie = (sel) =>
        getComputedStyle(document.querySelector(sel), '::after').transform
      return {
        kariera: podkreslenie('.site-nav__link[data-nav="kariera"]'),
        oferta: podkreslenie('.site-nav__trigger[data-nav="oferta"]'),
        cta: document.querySelector('.site-header .cta').textContent.trim().split('\n')[0],
      }
    })

    expect(s.kariera, 'kariera podkreslona').toBe('matrix(1, 0, 0, 1, 0, 0)')
    expect(s.oferta, 'oferta bez podkreslenia trasy').toBe('matrix(0, 0, 0, 1, 0, 0)')
    expect(s.cta).toBe('Aplikuj')
  })

  /*
   * Panel poziomy zyje od 75rem (1200 px). Ponizej nawigacje przejmuje
   * szuflada - ADR 0007 - wiec 1024 i 390 sprawdzamy osobnym testem.
   */
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1280, 800],
  ]) {
    test(`panel bez przepełnienia przy ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await otworz(page, '/kariera/')

      const w = await page.evaluate(() => {
        const nadmiar = [
          ...document.querySelectorAll('.mega__label, .mega__desc, .mega__meta'),
        ].map((el) => el.scrollWidth - el.clientWidth)
        return {
          strona: document.documentElement.scrollWidth - window.innerWidth,
          maxNadmiar: Math.max(...nadmiar),
        }
      })

      expect(w.strona, 'poziomy scroll').toBeLessThanOrEqual(0)
      expect(w.maxNadmiar, 'clipping tekstu w kolumnie').toBeLessThanOrEqual(1)
    })
  }

  /*
   * Ponizej 75rem nie ma panelu - jest szuflada. Ta sama czworka ofert
   * i te same adresy, tylko inny uklad. Kariera nie moze tu wypasc
   * z listy przez motyw.
   */
  for (const [width, height] of [
    [1024, 768],
    [390, 844],
  ]) {
    test(`szuflada niesie te sama oferte przy ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })

      const oferta = async (url) => {
        await page.goto(url)
        await page.locator('.site-header__toggle').click()
        await expect(page.locator('.drawer')).toBeVisible()
        await page.locator('.drawer__group summary').click()
        return page.evaluate(() =>
          [...document.querySelectorAll('.drawer__sublink')].map((a) =>
            [a.getAttribute('href'), a.textContent.trim().replace(/s+/g, ' ')].join(' | '),
          ),
        )
      }

      const home = await oferta('/')
      const kariera = await oferta('/kariera/')

      expect(kariera).toEqual(home)

      // Cztery produkty plus dwa odnosniki zbiorcze - tak jak w panelu.
      expect(kariera).toHaveLength(6)
      expect(kariera.filter((x) => x.startsWith('/oferta/'))).toHaveLength(5)
    })
  }
})
