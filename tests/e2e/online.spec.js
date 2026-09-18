import { expect, test } from '@playwright/test'

/**
 * /oferta/online/ — narracja fotograficzna strony.
 *
 * Gora pokazuje, KTO prowadzi, dol - DLA KOGO sa zajecia. Wczesniej oba
 * miejsca mialy ten sam kadr z podzialem ekranu i mowily dokladnie to samo,
 * wiec testy pilnuja przede wszystkim tego, ze sa to DWA ROZNE zdjecia
 * i ze stoja we wlasciwej kolejnosci.
 */

const WIDOKI = [
  [1920, 1080],
  [1440, 900],
  [1280, 800],
  [1024, 768],
  [768, 1024],
  [430, 932],
  [390, 844],
]

test.describe('online 1 na 1', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/oferta/online/')
  })

  test('siedem aktow w ustalonej kolejnosci', async ({ page }) => {
    const kolejnosc = await page.evaluate(() =>
      [...document.querySelectorAll('main > section')].map(
        (el) => el.getAttribute('aria-labelledby') ?? el.id ?? el.className,
      ),
    )

    expect(kolejnosc).toEqual([
      'online-title',
      'online-deklaracja',
      'online-kroki',
      'online-dla-kogo',
      'online-cta',
    ])

    await expect(page.locator('header.site-header')).toHaveCount(1)
    await expect(page.locator('footer.site-footer')).toHaveCount(1)
  })

  /*
   * Sedno przebudowy. Dwa kadry, dwa rozne pliki, dwie rozne role.
   */
  test('hero pokazuje lektorke, a "Dla kogo" ucznia', async ({ page }) => {
    const hero = page.locator('.page-hero__media img')
    const uczen = page.locator('.split__media img')

    await expect(hero).toHaveAttribute('src', /online-lesson/)
    await expect(uczen).toHaveAttribute('src', /online-student/)

    const zrodla = await page.evaluate(() =>
      [...document.querySelectorAll('main .media img')].map((el) => el.currentSrc || el.src),
    )
    expect(new Set(zrodla).size, 'kazdy kadr inny').toBe(zrodla.length)

    /*
     * Alt opisuje SCENE, nie tozsamosc - zdjecia sa ilustracyjne i nie
     * przedstawiaja osob zwiazanych ze szkola (par. 4 i D4).
     */
    await expect(hero).toHaveAttribute(
      'alt',
      'Lektorka prowadząca indywidualną lekcję języka online',
    )
    await expect(uczen).toHaveAttribute('alt', 'Uczeń uczestniczący w indywidualnej lekcji online')

    for (const img of [hero, uczen]) {
      await expect(img).not.toHaveAttribute('alt', /High Five/)
      await expect(img).toHaveCSS('object-fit', 'cover')
    }
  })

  /*
   * Naglowek w TRZECH wierszach i bez kropek - decyzja wlasciciela
   * z 18.09.2026. Wczesniej byly dwa: "Online 1 na 1 / W Twoim tempie".
   * Podzial ma byc SWIADOMY, wiec niosa go <br /> w HTML, a nie szerokosc
   * kolumny - dlatego test liczy wiersze, a nie sprawdza samego tekstu.
   *
   * `\s+` zamiast spacji: cyfry w drugim wierszu wiaze twarda spacja (par. 5),
   * ktorej zwykla spacja w asercji nie dopasuje.
   */
  test('naglowek ma trzy wiersze, bez kropek i bez powtorzenia etykiety', async ({ page }) => {
    const tytul = page.locator('.page-hero__title')
    await expect(tytul).toHaveText(/Angielski online\s+1\s+na\s+1\s+W Twoim tempie/)
    await expect(tytul).not.toContainText('.')

    const linie = await tytul.evaluate((el) =>
      Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)),
    )
    expect(linie).toBe(3)

    /*
     * Etykieta niesie sam kontekst - nie powtarza zadnego wiersza naglowka.
     * Brzmienie zwezone przez wlasciciela: kurs jest dla dzieci i mlodziezy,
     * dorosli z niego wypadli.
     */
    const etykieta = page.locator('.page-hero .section__label')
    await expect(etykieta).toHaveText(/Dzieci i\s+młodzież/)
    await expect(etykieta).not.toContainText(/doros/i)
    await expect(etykieta).not.toContainText(/1 na 1/i)
  })

  test('hero niesie trzy korzysci w jednym rzedzie', async ({ page }) => {
    const pozycje = page.locator('.perks__item')
    await expect(pozycje).toHaveCount(3)

    await expect(pozycje.nth(0)).toContainText('100% online')
    await expect(pozycje.nth(1)).toContainText('Indywidualne podejście')
    await expect(pozycje.nth(2)).toContainText('Realne efekty')

    /*
     * .page-hero__text jest kolumna flex z align-items: flex-start - bez
     * jawnej szerokosci lista kurczyla sie do tresci i trzy pozycje szly
     * jedna pod druga zamiast w rzedzie.
     */
    const y = await pozycje.evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().y)),
    )
    expect(new Set(y).size, 'wszystkie trzy w jednym rzedzie').toBe(1)

    /*
     * Nazwy sa w kolorze TEKSTU, nie sygnalowym. Czerwien niesie tu wezwanie
     * stojace wyzej; trzy czerwone napisy zaraz pod nim czytaly sie jak
     * kolejne odnosniki.
     */
    const SIGNAL = 'rgb(242, 59, 47)'
    await expect(page.locator('.perks__title').first()).not.toHaveCSS('color', SIGNAL)

    // Tylko kreski pionowe - poziomej nad blokiem juz nie ma.
    await expect(page.locator('.perks')).toHaveCSS('border-top-width', '0px')
    await expect(page.locator('.perks__item').nth(1)).not.toHaveCSS('border-left-width', '0px')
  })

  test('lista "Dla kogo" ma wlasny znacznik, nie punktor przegladarki', async ({ page }) => {
    const lista = page.locator('.split__list--check')
    await expect(lista.locator('li')).toHaveCount(6)
    await expect(lista).toHaveCSS('list-style-type', 'none')

    const znacznik = await lista
      .locator('li')
      .first()
      .evaluate((el) => getComputedStyle(el, '::before').content)
    expect(znacznik).not.toBe('none')
  })

  /*
   * Wymog wlasciciela powtorzony dwa razy w brief. Kursywa nie wystepuje
   * w jezyku typograficznym High Five w zadnym elemencie.
   */
  test('nigdzie nie ma kursywy', async ({ page }) => {
    const kursywa = await page.evaluate(() =>
      [...document.querySelectorAll('body *')]
        .filter((el) => getComputedStyle(el).fontStyle !== 'normal')
        .map((el) => el.className || el.tagName),
    )
    expect(kursywa).toEqual([])
  })

  test('polskie znaki w czerwonej deklaracji sa kompletne', async ({ page }) => {
    const claim = page.locator('.statement__claim')
    await expect(claim).toHaveText('Mówię. Ćwiczę. Rozwijam się.')

    // Tusz nie moze wystawac poza pudelko - tam scinalaby go maska reveal.
    const nadmiar = await claim.evaluate((el) => el.scrollWidth - el.clientWidth)
    expect(nadmiar).toBeLessThanOrEqual(1)
  })

  for (const [width, height] of WIDOKI) {
    test(`bez przepelnienia i z kadrami przy ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/oferta/online/')

      const w = await page.evaluate(() => {
        const nadmiar = (s) => {
          const el = document.querySelector(s)
          return el.scrollWidth - el.clientWidth
        }
        const widoczne = (s) => {
          const el = document.querySelector(s)
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.height > 0
        }
        return {
          strona: document.documentElement.scrollWidth - window.innerWidth,
          tytul: nadmiar('.page-hero__title'),
          claim: nadmiar('.statement__claim'),
          heroWidoczne: widoczne('.page-hero__media img'),
          uczenWidoczny: widoczne('.split__media img'),
        }
      })

      expect(w.strona, 'poziomy scroll').toBeLessThanOrEqual(0)
      expect(w.tytul, 'naglowek hero').toBeLessThanOrEqual(1)
      expect(w.claim, 'deklaracja').toBeLessThanOrEqual(1)

      // Zdjecia nie znikaja na malym ekranie - wymog wlasciciela.
      expect(w.heroWidoczne, 'kadr lektorki').toBe(true)
      expect(w.uczenWidoczny, 'kadr ucznia').toBe(true)
    })
  }
})
