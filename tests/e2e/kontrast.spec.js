import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * Regresja kontrastu — WCAG 2.2 AA (CLAUDE.md §13).
 *
 * Kontrastu nie da się ocenić z samego CSS: zależy od faktycznego tła pod
 * elementem, od przezroczystości koloru i od `opacity` całego łańcucha
 * przodków naraz. Dlatego mierzy go silnik axe w prawdziwej przeglądarce,
 * a nie własny skrypt — pierwsze podejście liczyło tło błędnie w sekcjach
 * z `[data-theme]` i dawało wyniki, którym nie można było ufać.
 *
 * Test sprawdza WYŁĄCZNIE kontrast. Pozostałe reguły dostępności mają
 * własne zamki w `tests/e2e/` i w `tests/smoke/`.
 */

const STRONY = [
  '/',
  '/oferta/',
  '/oferta/dzieci/',
  '/oferta/egzamin-osmoklasisty/',
  '/oferta/seniorzy/',
  '/oferta/online/',
  '/lokalizacje/',
  '/cennik/',
  '/kariera/',
  '/polityka-prywatnosci/',
]

/*
 * Kontrast mierzymy WYŁĄCZNIE w projekcie `reduced-motion`.
 *
 * Reveal wejściowy zaczyna się od `opacity: 0` i trwa 450-750 ms (§9), więc
 * element złapany w połowie animacji ma kontrast bliski zeru. Pierwsze
 * podejście czekało stałą chwilę po dodaniu klasy `is-visible` i axe
 * raportował tła w rodzaju `#f2675c` - czyli czerwień rozjaśnioną
 * niedokończonym przejściem - zamiast prawdziwego `#f23b2f`.
 *
 * Przy `prefers-reduced-motion: reduce` projekt z założenia pokazuje
 * wszystko od razu w stanie końcowym, więc nie ma czego czekać ani
 * wymuszać. DOM jest ten sam co na desktopie, więc niczego nie tracimy.
 */
const pokazWszystko = async (page) => {
  await page.evaluate(() =>
    document.querySelectorAll('[data-animation]').forEach((e) => e.classList.add('is-visible')),
  )
  await page.waitForTimeout(300)
}

const zbadaj = (page) => new AxeBuilder({ page }).withRules(['color-contrast']).analyze()

const opisz = (naruszenia) =>
  naruszenia
    .flatMap((n) => n.nodes)
    .map(
      (w) => `  ${w.target.join(' ')}\n    ${w.failureSummary?.split('\n').slice(0, 2).join(' ')}`,
    )
    .join('\n')

/*
 * WYŁĄCZONY DECYZJĄ WŁAŚCICIELA z 23.09.2026.
 *
 * Pomiary są prawdziwe i test działa. Właściciel obejrzał na żywo oba
 * warianty poprawki — przyciemnioną czerwień #cb3227 i podniesione
 * przygaszenia — i wybrał zachowanie obecnej palety. Liczby, zakres
 * odstępstwa i konsekwencje: docs/ACCESSIBILITY.md.
 *
 * Test zostaje w repozytorium, bo §13 kontraktu deklaruje WCAG 2.2 AA
 * jako wymóg. Gdy właściciel wróci do tematu, wystarczy zdjąć `.skip`
 * i od razu widać, co i gdzie nie przechodzi — bez odtwarzania całego
 * pomiaru od zera.
 *
 * ZDJĘCIE `.skip` BEZ WCZEŚNIEJSZEJ ZMIANY PALETY WYWRÓCI CI.
 */
test.describe.skip('kontrast tekstu - WCAG AA', () => {
  for (const url of STRONY) {
    test(`${url} bez naruszen kontrastu`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'reduced-motion', 'kontrast mierzymy na stanie koncowym')

      await page.goto(url)
      await pokazWszystko(page)

      const wynik = await zbadaj(page)
      expect(wynik.violations, opisz(wynik.violations)).toEqual([])
    })
  }

  /*
   * Stan wskazania ma własny kontrast - przycisk zmienia wtedy i tło,
   * i kolor tekstu naraz, więc wynik spoczynku niczego o nim nie mówi.
   */
  test('wezwania zachowuja kontrast po najechaniu', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'reduced-motion', 'hover na stanie koncowym, bez animacji')

    await page.goto('/')
    await pokazWszystko(page)

    const wezwania = page.locator('main .cta')
    const ile = await wezwania.count()
    expect(ile, 'sa jakies wezwania do sprawdzenia').toBeGreaterThan(0)

    for (let i = 0; i < ile; i++) {
      await wezwania.nth(i).hover()
      await page.waitForTimeout(250)
      const wynik = await zbadaj(page)
      expect(
        wynik.violations,
        `po najechaniu na wezwanie ${i + 1}\n` + opisz(wynik.violations),
      ).toEqual([])
    }
  })

  /*
   * Focus ring musi byc widoczny - par. 13 zabrania `outline: none`
   * bez zamiennika. Sprawdzamy, ze pierwszy element w kolejnosci focusu
   * dostaje widoczny sygnal, a nie samo przesuniecie karetki.
   */
  test('focus jest widoczny na wezwaniu w naglowku', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'reduced-motion', 'nawigacja klawiatura, stan koncowy')

    await page.goto('/')
    const cta = page.locator('.site-header .cta').first()
    await cta.focus()

    const sygnal = await cta.evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0,
        cien: s.boxShadow !== 'none',
        obramowanie: parseFloat(s.borderTopWidth) > 0,
      }
    })

    expect(
      sygnal.outline || sygnal.cien || sygnal.obramowanie,
      'focus daje widoczny sygnal, nie samo `outline: none`',
    ).toBe(true)
  })
})
