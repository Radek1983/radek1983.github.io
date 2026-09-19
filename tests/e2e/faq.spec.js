import { expect, test } from '@playwright/test'

/**
 * FAQ — dane strukturalne muszą mówić dokładnie to, co widzi człowiek.
 *
 * Oznaczenie `FAQPage` powtarza treść sekcji 11 w JSON-LD, więc żyje ona
 * w dwóch miejscach naraz. Google odrzuca oznaczenie, które rozjeżdża się
 * z widoczną stroną, a rozjazd jest tu wyjątkowo łatwy: wystarczy poprawić
 * jedno słowo w pytaniu i zapomnieć o drugim miejscu.
 *
 * Ten test porównuje oba źródła automatycznie, więc rozjazd zatrzyma się
 * na CI, a nie w raporcie wyszukiwarki.
 *
 * Czego NIE pilnujemy: samego brzmienia pytań. FAQ jest jedyną otwartą
 * sekcją strony głównej (CLAUDE.md §18), więc właściciel może je zmieniać
 * swobodnie — test wymaga tylko, żeby zmiana trafiła w oba miejsca.
 */

/*
 * Twarde spacje to skład, nie treść — w porównaniu nie mają znaczenia.
 *
 * Znak powstaje przez `fromCharCode`, a nie jako sekwencja ucieczki
 * w wyrażeniu regularnym: Prettier rozwija taką sekwencję do samego znaku,
 * a ESLint odrzuca go potem regułą `no-irregular-whitespace`. Ta para
 * narzędzi już raz zablokowała tu pracę.
 */
const NBSP = String.fromCharCode(160)

const normalizuj = (s) => s.replaceAll(NBSP, ' ').replace(/\s+/g, ' ').trim()

const odczytajFaqPage = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((b) => JSON.parse(b.textContent))
      .find((o) => o['@type'] === 'FAQPage'),
  )

test.describe('FAQ - dane strukturalne', () => {
  test('oznaczenie FAQPage zgadza sie co do slowa z widoczna trescia', async ({ page }) => {
    await page.goto('/')

    const widoczne = await page.evaluate(() =>
      [...document.querySelectorAll('#faq details')].map((d) => ({
        pytanie: d.querySelector('.faq__question').textContent,
        odpowiedz: d.querySelector('.faq__answer').textContent,
      })),
    )

    const dane = await odczytajFaqPage(page)

    expect(dane, 'strona ma oznaczenie FAQPage').toBeTruthy()
    expect(dane.mainEntity, 'tyle samo pytan co w sekcji').toHaveLength(widoczne.length)

    for (const [i, pozycja] of widoczne.entries()) {
      /*
       * Widoczne pytanie niesie też znak plus/minus w `.faq__sign`, który
       * jest `aria-hidden` i nie należy do treści — stąd `toContain`
       * zamiast równości.
       */
      expect(normalizuj(pozycja.pytanie), `pytanie ${i + 1}`).toContain(
        normalizuj(dane.mainEntity[i].name),
      )
      expect(normalizuj(pozycja.odpowiedz), `odpowiedz ${i + 1}`).toBe(
        normalizuj(dane.mainEntity[i].acceptedAnswer.text),
      )
    }
  })

  test('kazde pytanie ma niepusta odpowiedz we wlasciwym typie', async ({ page }) => {
    await page.goto('/')

    const dane = await odczytajFaqPage(page)
    expect(dane.inLanguage).toBe('pl-PL')

    for (const [i, q] of dane.mainEntity.entries()) {
      expect(q['@type'], `typ pytania ${i + 1}`).toBe('Question')
      expect(q.acceptedAnswer['@type'], `typ odpowiedzi ${i + 1}`).toBe('Answer')
      expect(q.name.length, `pytanie ${i + 1} nie jest puste`).toBeGreaterThan(5)
      expect(q.acceptedAnswer.text.length, `odpowiedz ${i + 1} nie jest pusta`).toBeGreaterThan(10)
    }
  })

  /*
   * Oznaczenie stoi TYLKO na stronie glownej - tam, gdzie jest sekcja FAQ.
   * Powielenie go na podstronach byloby deklaracja tresci, ktorej tam nie ma.
   */
  test('FAQPage nie wycieka na podstrony', async ({ page }) => {
    for (const url of ['/oferta/', '/cennik/', '/oferta/dzieci/']) {
      await page.goto(url)
      expect(await odczytajFaqPage(page), `${url} bez FAQPage`).toBeUndefined()
    }
  })
})
