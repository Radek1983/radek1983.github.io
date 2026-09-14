import { expect, test } from '@playwright/test'

/**
 * 05 O HIGH FIVE — układ zatwierdzony przez właściciela.
 *
 * Sekcja przechodziła najdłuższą serię poprawek ze wszystkich: szerokość
 * akapitów rosła w pięciu krokach, a kadr Magdaleny Germel dostał zupełnie
 * nową geometrię — kończy się równo z dołem kolumny tekstowej i zwęża się
 * od lewej, gdy tekst jest krótszy.
 *
 * Czego pilnujemy:
 *   1. kadr kończy się dokładnie tam, gdzie kolumna tekstowa,
 *   2. prawa krawędź kadru stoi na krawędzi okna — wspólna oś ze zdjęciami
 *      hero i sekcji 02,
 *   3. kadr NIE wchodzi na kolumnę tekstową przy żadnej szerokości,
 *   4. kotwica z menu zatrzymuje sekcję na tyle wysoko, żeby pasek faktów
 *      u jej dołu mieścił się w ekranie.
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D11).
 */

const WIDOKI = [
  [1920, 1000],
  [1600, 950],
  [1440, 900],
  [1280, 800],
]

/*
 * Pozycje z ukladu, nie z getBoundingClientRect.
 *
 * Prostokaty ekranowe niosa takze `translate` warstwy reveal, wiec element,
 * ktory jeszcze nie wszedl w kadr, raportuje pozycje przesunieta o 24 px.
 * W tym pliku mierzymy geometrie, a nie animacje, wiec sumujemy offsety.
 */
const dol = (page, selektor) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel)
    let y = 0
    let e = el
    while (e) {
      y += e.offsetTop
      e = e.offsetParent
    }
    return y + el.offsetHeight
  }, selektor)

test.describe('05 o high five - uklad zatwierdzony', () => {
  test.skip(({ isMobile }) => isMobile, 'uklad dwukolumnowy dziala od 62rem')

  for (const [width, height] of WIDOKI) {
    test(`kadr konczy sie razem z kolumna tekstowa przy ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)

      const dolKadru = await dol(page, '.about__media')
      const dolTekstu = await dol(page, '.about__text')

      /*
       * Kadr NIGDY nie wystaje pod tekst - to bylo sedno zgloszenia
       * wlasciciela: drugie wiersze podpisow wychodzily pod jego krawedz.
       */
      expect(dolKadru, `kadr ${dolKadru} vs tekst ${dolTekstu}`).toBeLessThanOrEqual(dolTekstu + 1)

      /*
       * Rownosc obowiazuje tam, gdzie kadr ma jeszcze miejsce w szerokosc.
       * Ponizej okolo 1400 px zatrzymuje go limit czterech pol siatki
       * (inaczej wszedlby na tekst), wiec bywa nizszy niz kolumna - to
       * swiadomy kompromis opisany w about.css.
       */
      if (width >= 1440) {
        expect(Math.abs(dolKadru - dolTekstu), `${dolKadru} vs ${dolTekstu}`).toBeLessThanOrEqual(1)
      }
    })

    test(`kadr nie wchodzi na tekst przy ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      /*
       * Tu prostokaty ekranowe, nie offsety: mierzymy poziomo, a offsetLeft
       * liczy sie od rodzica pozycjonujacego, nie od krawedzi okna. Warstwa
       * reveal przesuwa wylacznie w pionie, wiec w tej osi rect jest wiarygodny.
       */
      const m = await page.evaluate(() => {
        const kadr = document.querySelector('.about__media').getBoundingClientRect()
        const tekst = document.querySelector('.about__text').getBoundingClientRect()
        return {
          nachodzi: Math.round(tekst.right - kadr.left),
          odPrawej: Math.round(window.innerWidth - kadr.right),
        }
      })

      expect(m.nachodzi, 'kadr na kolumnie tekstowej').toBeLessThanOrEqual(0)

      // Prawa krawedz na krawedzi okna - zapas na pasek przewijania.
      expect(m.odPrawej, 'kadr przy krawedzi okna').toBeLessThanOrEqual(20)
    })
  }

  /*
   * Pasek faktow zamyka sekcje. Po skoku z menu musi zmiescic sie w ekranie
   * razem z reszta - wlasciciel zglosil, ze drugie wiersze podpisow byly
   * ucinane dolna krawedzia okna.
   */
  test('po skoku z menu widac cala sekcje razem z paskiem faktow', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'menu poziome od 75rem')

    await page.setViewportSize({ width: 1536, height: 900 })
    await page.goto('/')
    await page.evaluate(() => document.querySelector('[data-nav="o-nas"]').click())
    await page.waitForTimeout(1200)

    const w = await page.evaluate(() => {
      const marks = document.querySelector('.about__marks').getBoundingClientRect()
      const naglowek = document.querySelector('.site-header').getBoundingClientRect()
      const etykieta = document.querySelector('#o-nas .section__label').getBoundingClientRect()
      return {
        dolPaska: Math.round(marks.bottom),
        oknoWysokosc: window.innerHeight,
        odstepPodNaglowkiem: Math.round(etykieta.top - naglowek.bottom),
      }
    })

    expect(w.dolPaska, 'pasek faktow w calosci w ekranie').toBeLessThanOrEqual(w.oknoWysokosc)
    expect(w.odstepPodNaglowkiem, 'etykieta tuz pod naglowkiem').toBeLessThanOrEqual(28)
    expect(w.odstepPodNaglowkiem, 'ale nie pod nim').toBeGreaterThanOrEqual(8)
  })

  test('cztery fakty w zatwierdzonym brzmieniu', async ({ page }) => {
    await page.goto('/')

    const fakty = page.locator('.about__mark')
    await expect(fakty).toHaveCount(4)

    for (const [i, [haslo, opis]] of [
      ['20+', 'lat doświadczenia'],
      ['UW + SWPS', 'lingwistyka + tłumaczenia'],
      ['Dyplomowana', 'nauczycielka angielskiego'],
      ['OKE', 'egzaminatorka'],
    ].entries()) {
      await expect(fakty.nth(i).locator('strong')).toHaveText(haslo)
      await expect(fakty.nth(i).locator('span')).toHaveText(opis)
    }
  })
})
