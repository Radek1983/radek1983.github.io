import { expect, test } from '@playwright/test'

/**
 * 09 LOKALIZACJE — stan zatwierdzony przez właściciela.
 *
 * Właściciel poprosił, żeby wezwanie "Wyznacz trasę" przestało być przyciskiem
 * obrysowym i wyglądało dokładnie jak wezwanie z hero: czarne tło, jasna
 * czcionka, czerwień po najechaniu. To ten sam wariant komponentu (`cta--ink`),
 * a nie osobne style - dzięki temu oba przyciski nie mogą się rozjechać.
 *
 * Czego pilnujemy:
 *   1. przycisk ma dokładnie te same kolory co wezwanie w hero,
 *   2. po najechaniu tło zmienia się na kolor sygnałowy,
 *   3. na stronie głównej nie wraca wariant obrysowy,
 *   4. odnośnik nadal prowadzi do trasy na adres SP 402 i otwiera się
 *      bezpiecznie w nowej karcie.
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D15).
 */

const kolory = (page, selektor) =>
  page.evaluate((sel) => {
    const s = getComputedStyle(document.querySelector(sel))
    return { tlo: s.backgroundColor, tekst: s.color }
  }, selektor)

test.describe('09 lokalizacje - wezwanie zatwierdzone', () => {
  /*
   * INK i PAPER z palety marki - nie czerń przeglądarki i nie czysta biel.
   *
   * Oba przyciski mają przypisane te same konkretne wartości zamiast być
   * porównywane ze sobą. Równość nadal jest pilnowana, tylko mocniej:
   * porównanie `trasa === hero` przeszłoby także wtedy, gdyby oba naraz
   * zjechały na inny kolor.
   *
   * `toHaveCSS` zamiast ręcznego `getComputedStyle`, bo ponawia odczyt.
   * `.cta` jest jedynym elementem w serwisie z `transition: background-color`
   * (components/buttons.css), a WebKit potrafi oddać wartość w połowie
   * interpolacji - w CI wyszło z tego `rgba(10, 10, 10, 0.996)` zamiast
   * `rgb(10, 10, 10)` i zatrzymało wydanie. Ten sam problem rozwiązuje
   * `expect.poll` w teście hovera niżej.
   */
  const INK = 'rgb(10, 10, 10)'
  const PAPER = 'rgb(242, 239, 232)'

  test('wyznacz trase ma te same kolory co wezwanie w hero', async ({ page }) => {
    await page.goto('/')

    for (const selektor of ['#lokalizacja .cta', '.hero .cta']) {
      const cta = page.locator(selektor)
      await expect(cta, `tło ${selektor}`).toHaveCSS('background-color', INK)
      await expect(cta, `tekst ${selektor}`).toHaveCSS('color', PAPER)
    }
  })

  test('po najechaniu tlo zmienia sie na kolor sygnalowy', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'hover ma sens tylko na wskazniku')

    await page.goto('/')
    await page.locator('#lokalizacja .cta').hover()

    /*
     * expect.poll, bo tlo jest animowane przejsciem - pierwszy odczyt
     * potrafi zlapac wartosc w polowie drogi.
     */
    await expect
      .poll(async () => (await kolory(page, '#lokalizacja .cta')).tlo)
      .toBe('rgb(242, 59, 47)')
  })

  test('na stronie glownej nie zostal przycisk obrysowy', async ({ page }) => {
    await page.goto('/')

    /*
     * Wariant `cta--ghost` zyje dalej na podstronach i tam ma zostac.
     * Na stronie glownej wlasciciel go zdjal - to jedyne miejsce, gdzie stal.
     */
    await expect(page.locator('main .cta--ghost')).toHaveCount(0)
  })

  test('odnosnik prowadzi do trasy na adres SP 402', async ({ page }) => {
    await page.goto('/')

    const link = page.locator('#lokalizacja .cta')
    await expect(link).toHaveAttribute('href', /google\.com\/maps\/dir/)
    await expect(link).toHaveAttribute('href', /Nowaka-Jezioranskiego\+22/)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  })
})
