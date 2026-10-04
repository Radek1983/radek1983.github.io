import { expect, test } from '@playwright/test'

/**
 * Higiena językowa tekstów.
 *
 * Audyt całego serwisu wyłapał cztery usterki, których nie widać w kodzie,
 * a widać je na stronie. Testy niżej pilnują ich osobno, bo każda wraca
 * inną drogą: przez copy-paste, przez edytor podmieniający znaki albo
 * przez dopisanie nowego akapitu obok istniejącego.
 */

const STRONY = [
  '/',
  '/oferta/',
  '/oferta/dzieci/',
  '/oferta/egzamin-osmoklasisty/',
  '/oferta/seniorzy/',
  '/oferta/online/',
  '/cennik/',
  '/lokalizacje/',
  '/kariera/',
  '/404.html',
]

/* Cały widoczny tekst strony: nagłówek, treść, stopka, alt i aria. */
const tekst = (page) =>
  page.evaluate(() => {
    for (const d of document.querySelectorAll('details')) d.open = true
    const opisy = [...document.querySelectorAll('[alt],[aria-label],[title]')]
      .flatMap((el) => [
        el.getAttribute('alt'),
        el.getAttribute('aria-label'),
        el.getAttribute('title'),
      ])
      .filter(Boolean)
    return [document.body.innerText, ...opisy].join('\n')
  })

test.describe('higiena językowa', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'tekst jest ten sam w każdym silniku')
    await page.setViewportSize({ width: 1440, height: 900 })
  })

  /*
   * Uszkodzone kodowanie potrafi wejść przez wklejenie tekstu z pliku
   * zapisanego w innej stronie kodowej. Efekt to "zajÄ™cia" zamiast "zajęcia" -
   * czytelne dopiero w przeglądarce, nie w diffie.
   */
  test('nigdzie nie ma uszkodzonego kodowania', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const t = await tekst(page)
      expect(t, `mojibake na ${url}`).not.toMatch(/Ã.|Å.|â€|ï»¿|�/)
    }
  })

  /*
   * Serwis pisze wtrącenia myślnikiem (—). Półpauza (–) wchodziła przez
   * autokorektę edytora i to samo zdanie na dwóch stronach miało dwa różne
   * znaki. Konsekwencja jest tu tańsza niż dyskusja o typografii.
   *
   * WYJĄTEK: półpauza między cyframi to ZAKRES, nie wtrącenie — `17:00–21:00`
   * w sekcji zapisów na /oferta/dzieci/ jest typograficznie poprawne i zostało
   * tak zamówione przez właściciela wprost. Zakaz dotyczy więc półpauzy, która
   * nie ma cyfry po obu stronach.
   */
  test('wtrącenia zapisujemy jednym znakiem', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const t = await tekst(page)
      expect(t, `półpauza zamiast myślnika na ${url}`).not.toMatch(/(?<!\d)–|–(?!\d)/)
    }
  })

  test('brak podwójnych spacji i spacji przed interpunkcją', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const t = await tekst(page)

      for (const wiersz of t.split('\n')) {
        const l = wiersz.trim()
        if (!l) continue
        expect(l, `podwójna spacja na ${url}`).not.toMatch(/ {2,}/)
        expect(l, `spacja przed interpunkcją na ${url}`).not.toMatch(/\s[.,;:!?]/)
      }
    }
  })

  /*
   * Trzy konkretne błędy znalezione w audycie. Każdy jest krótki, więc
   * łatwo wraca przy kolejnym przepisywaniu akapitu.
   */
  test('poprawione błędy gramatyczne nie wracają', async ({ page }) => {
    await page.goto('/')
    const t = await tekst(page)

    /*
     * Rodzaj: "przygotowanie" jest nijakie, więc "osobne", nie "osobny".
     *
     * Samej frazy nie ma już na stronie - właściciel przepisał FAQ
     * 04.10.2026 i stoi tam dziś "kurs przygotowujący". Zakaz zostaje,
     * bo ten błąd wraca przy każdym przepisywaniu akapitu; pozytywna
     * asercja celuje w zdanie, które faktycznie jest na stronie.
     */
    expect(t).not.toMatch(/osobny przygotowanie/)
    expect(t).toMatch(/osobny kurs przygotowujący do\s+egzaminu/)

    /*
     * Czasownik zwrotny: "przekłada SIĘ na". Zdanie prowadzi dalej inaczej
     * niż w audycie - właściciel przepisał cały akapit 18.09.2026 i zamiast
     * "przekłada się na High Five" stoi tam "przekłada się na sposób, w jaki
     * pracujemy w High Five". Pilnujemy samego zwrotu, nie reszty zdania.
     */
    expect(t).toMatch(/przekłada\s+się na/)
    expect(t).not.toMatch(/doświadczenie przekłada na/)
  })

  /*
   * Osoba prowadząca ma jedno imię w całym serwisie. "Magda" na stronie
   * seniorów wyglądała jak inna osoba niż "Magdalena" na stronie głównej.
   */
  test('osoba prowadząca nazywa się wszędzie tak samo', async ({ page }) => {
    for (const url of STRONY) {
      await page.goto(url)
      const t = await tekst(page)

      if (!/Germel/.test(t)) continue
      expect(t, `skrócone imię na ${url}`).not.toMatch(/\bMagda\b(?!lena)/)
      expect(t, `pełne imię na ${url}`).toMatch(/Magdalen[aęy] Germel/)
    }
  })
})

/*
 * Scena metody. "Mówij" nie jest polskim słowem - tryb rozkazujący od
 * "mówić" to "mów". Błędna forma stoi w master prompcie i w briefie,
 * więc wraca przy każdym przepisywaniu copy ze źródła. ADR 0009.
 */
test.describe('06 jak uczymy', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-chromium', 'tekst jest ten sam w każdym silniku')
    await page.goto('/')
  })

  test('cztery czasowniki w trybie rozkazującym, bez kropek', async ({ page }) => {
    const czasowniki = page.locator('.method__verb')
    await expect(czasowniki).toHaveText(['Mów', 'Próbuj', 'Poprawiaj', 'Używaj'])

    const t = await tekst(page)
    expect(t, 'wróciła forma "mówij"').not.toMatch(/[Mm]ówij/i)
  })

  /*
   * Etykieta sekcji i pierwszy czasownik stały zbyt blisko siebie: ujemny
   * margines z warstwy anty-przycinającej podciągał pierwszy element
   * o 0.18em i napis kleił się do "06 JAK UCZYMY". Odstęp daje dziś
   * `margin` listy czasowników, czyli 23 px przy oknie 1440.
   *
   * POMIAR MUSI BYĆ PO PRZEWINIĘCIU SEKCJI W KADR i to nie jest kosmetyka.
   * `.method__verb` ma animację sterowaną przewijaniem (`animation-timeline:
   * view()`), która startuje od `translate: 0 0.4em`. Przy stopniu 92 px to
   * 36,8 px w dół - dokładnie tyle, ile ten test "zyskiwał", mierząc sekcję
   * stojącą daleko pod krawędzią okna.
   *
   * Przez to test przez długi czas pilnował stanu, którego nikt nie widzi:
   * lokalnie pomiar zawsze wyprzedzał animację i wychodziło 59,8 px, a na
   * wolniejszym runnerze CI raz wyszło 23,0 px i test padł. Nie była to
   * regresja w kodzie, tylko wyścig w pomiarze - stąd "flaky" w CI.
   *
   * Próg 20 px odróżnia stan zdrowy (23 px) od zepsutego: powrót ujemnego
   * marginesu anty-przycinającego zbiłby odstęp do około 6 px.
   */
  test('pierwszy czasownik nie klei się do etykiety sekcji', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    await page.locator('#metoda').scrollIntoViewIfNeeded()
    await page.evaluate(() => document.fonts.ready)

    const odstep = await page.evaluate(() => {
      const etykieta = document.querySelector('#metoda .section__label')
      const pierwszy = document.querySelector('.method__verb')
      return pierwszy.getBoundingClientRect().top - etykieta.getBoundingClientRect().bottom
    })

    expect(odstep).toBeGreaterThanOrEqual(20)
  })
})
