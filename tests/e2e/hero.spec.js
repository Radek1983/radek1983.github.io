import { expect, test } from '@playwright/test'

/**
 * 01 HERO — układ zatwierdzony przez właściciela.
 *
 * Sekcja została domknięta po serii poprawek robionych na żywo i właściciel
 * wprost poprosił, żeby jej już nie ruszać. Ten plik jest zabezpieczeniem
 * tamtej decyzji: nie opisuje "ładnego" hero, tylko dokładnie ten układ,
 * który został zaakceptowany.
 *
 * Trzy rzeczy, o które chodziło:
 *   1. cały tekst leży w GÓRNEJ, jasnej partii kadru - niżej zaczynają się
 *      postacie i czarna typografia traciła kontrast,
 *   2. lead łamie się na CZTERY wiersze, nie na trzy,
 *   3. nagłówek trzyma po jednym zdaniu w wierszu.
 *
 * Zmiana któregokolwiek z tych punktów wymaga decyzji właściciela, nie
 * poprawki "przy okazji" (CLAUDE.md par. 15, D7).
 */

const WIDOKI = [
  [1920, 950],
  [1680, 900],
  [1440, 900],
  [1280, 800],
]

/** Pomiar bloku tekstowego względem kadru. */
const uklad = (page) =>
  page.evaluate(() => {
    const linie = (sel) => {
      const el = document.querySelector(sel)
      return Math.round(
        el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight),
      )
    }
    const kadr = document.querySelector('.hero__media').getBoundingClientRect()
    const cta = document.querySelector('.hero__overlay .cta').getBoundingClientRect()
    const wordmark = document.querySelector('.hero__wordmark').getBoundingClientRect()

    return {
      leadLinie: linie('.hero__lead'),
      tytulLinie: linie('.hero__title'),

      // Udzial wysokosci kadru, na ktorym konczy sie blok tekstu.
      dolBloku: (cta.bottom - kadr.top) / kadr.height,
      goraBloku: (wordmark.top - kadr.top) / kadr.height,

      // Prawa krawedz najszerszego elementu tekstowego, jako udzial okna.
      prawaTekstu:
        Math.max(
          ...[...document.querySelectorAll('.hero__overlay > *')].map(
            (el) => el.getBoundingClientRect().right,
          ),
        ) / window.innerWidth,
    }
  })

test.describe('01 hero - uklad zatwierdzony', () => {
  for (const [width, height] of WIDOKI) {
    test(`blok tekstu stoi w gornej czesci kadru przy ${width}x${height}`, async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name === 'mobile-safari', 'uklad nakladkowy dziala od 62rem')

      await page.setViewportSize({ width, height })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)

      const m = await uklad(page)

      /*
       * Sedno poprawki. Blok byl wysrodkowany pionowo i schodzil na wysokosc,
       * gdzie konczy sie jasna sciana. Ma zamykac sie wyraznie powyzej dolu
       * kadru - inaczej wezwanie ladowaloby na blacie i ksiazkach.
       */
      expect(m.dolBloku, 'dol bloku w kadrze').toBeLessThan(0.82)
      expect(m.goraBloku, 'gora bloku w kadrze').toBeGreaterThan(0.02)

      // Lead lamie sie na cztery wiersze - jawne zyczenie wlasciciela.
      expect(m.leadLinie, 'wiersze leadu').toBe(4)

      // Kazde zdanie naglowka w jednej linii.
      expect(m.tytulLinie, 'wiersze naglowka').toBe(2)

      /*
       * Tekst nie moze siegnac postaci. Pusta sciana konczy sie okolo 44%
       * szerokosci kadru; --measure-hero-safe trzyma 40vw z zapasem.
       */
      expect(m.prawaTekstu, 'prawa krawedz tekstu').toBeLessThanOrEqual(0.42)
    })
  }
})
