import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

/**
 * /polityka-prywatnosci/ — zamek zatwierdzonego dokumentu (D21, ADR 0011).
 *
 * Ta strona rozni sie od pozostalych zamkow jedna rzecza: jej tresc jest
 * DOKUMENTEM PRAWNYM, a nie copy. Testy pilnuja wiec dwoch warstw naraz -
 * zgodnosci tresci z dokumentem zrodlowym oraz ukladu, ktory wlasciciel
 * zatwierdzil 19.09.2026.
 *
 * Czerwony test w tym pliku oznacza, ze rozjechal sie jeden z dwoch:
 * albo strona przestala odpowiadac polityce, albo zatwierdzony uklad.
 * W obu wypadkach naprawia sie KOD, nie asercje.
 */

const ADRES = '/polityka-prywatnosci/'

/*
 * Numer i tytul kazdego z osiemnastu rozdzialow, w kolejnosci z dokumentu.
 * Zapisane WPROST, a nie wyliczone ze strony - inaczej test potwierdzalby
 * sam siebie i przepuscilby usuniecie albo przestawienie rozdzialu.
 */
const ROZDZIALY = [
  '1. Kto jest administratorem danych?',
  '2. Współadministracja danych dotyczących zajęć dla klas 1-7',
  '3. Jakie dane przetwarzamy?',
  '4. Dane dotyczące zdrowia i inne dane szczególnej kategorii',
  '5. W jakich celach i na jakiej podstawie przetwarzamy dane?',
  '6. Czy podanie danych jest obowiązkowe?',
  '7. Komu możemy udostępniać dane?',
  '8. Zajęcia online',
  '9. Facebook',
  '10. Czy dane są przekazywane poza Europejski Obszar Gospodarczy?',
  '11. Jak długo przechowujemy dane?',
  '12. Gdzie przechowujemy dane?',
  '13. Pliki cookies i analityka',
  '14. Jakie prawa przysługują osobom, których dane dotyczą?',
  '15. Prawo do wniesienia skargi',
  '16. Czy podejmujemy decyzje automatycznie?',
  '17. Bezpieczeństwo danych',
  '18. Zmiany Polityki prywatności',
]

/*
 * Fakty, ktore polityka wnosi do serwisu jako JEDYNE miejsce ich publikacji.
 * Gdyby ktos je kiedys "poprawil", musi to zrobic swiadomie - razem
 * z dokumentem zrodlowym.
 */
const FAKTY_Z_DOKUMENTU = [
  'High Five AGNIESZKA KAROLEWSKA',
  'NIP: 7743272366',
  'REGON: 523300869',
  'ul. Miodowa 16 lok. 10, 09-400 Płock',
  'ul. Jana Nowaka-Jeziorańskiego 7 lok. 199, 03-984 Warszawa',
  'NIP: 8241730595',
  'REGON: 523281712',
  'art. 6 ust. 1 lit. b RODO',
  'art. 6 ust. 1 lit. c RODO',
  'art. 6 ust. 1 lit. f RODO',
  'przez okres trwania zajęć oraz przez 5 lat po ich zakończeniu',
  'do 12 miesięcy od zakończenia kontaktu',
  'ul. Stanisława Moniuszki 1A, 00-014 Warszawa',
  'Aktualna wersja: 1.0',
  'Obowiązuje od: 20 września 2026 r.',
]

const normalizuj = (tekst) =>
  tekst
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

test.describe('polityka prywatnosci - tresc', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(ADRES)
  })

  test('osiemnascie rozdzialow w kolejnosci z dokumentu', async ({ page }) => {
    const tytuly = await page.evaluate(() =>
      [...document.querySelectorAll('.policy__title')].map((el) =>
        el.textContent
          .replace(/\u00a0/g, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
      ),
    )

    expect(tytuly).toEqual(ROZDZIALY)
  })

  test('numer jest czescia tytulu, a nad naglowkiem nie ma drugiego', async ({ page }) => {
    /* Wlasciciel kazal zdjac drobne numery nad naglowkami jako powtorzenie. */
    await expect(page.locator('.policy__number')).toHaveCount(0)

    for (const tytul of ROZDZIALY) {
      expect(tytul).toMatch(/^\d+\. /)
    }
  })

  test('fakty z dokumentu stoja na stronie co do znaku', async ({ page }) => {
    const tresc = normalizuj(await page.locator('.policy__doc').innerText())

    for (const fakt of FAKTY_Z_DOKUMENTU) {
      expect(tresc, `brakuje: ${fakt}`).toContain(fakt)
    }
  })

  /* Metryczka dokumentu stoi w naglowku strony, nie w kolumnie tresci. */
  test('naglowek strony podaje wersje i date obowiazywania', async ({ page }) => {
    const meta = normalizuj(await page.locator('.policy-hero__meta').innerText())
    expect(meta).toContain('Wersja 1.0')
    expect(meta).toContain('obowiązuje od 20 września 2026 r.')
  })

  test('wyliczenia sa listami, nie luznymi akapitami', async ({ page }) => {
    const listy = page.locator('.policy__doc ul.policy__list')
    expect(await listy.count()).toBeGreaterThan(5)

    /*
     * Reset serwisu (ul[class] w base/reset.css) ma wyzsza specyficznosc
     * niz sama klasa i zjadal punktory razem z wcieciem. Bez tego wyliczenia
     * czytaja sie jak ciag akapitow.
     */
    const pierwsza = listy.first()
    await expect(pierwsza).toHaveCSS('list-style-type', 'disc')
    const wciecie = await pierwsza.evaluate((el) =>
      Number.parseFloat(getComputedStyle(el).paddingInlineStart),
    )
    expect(wciecie).toBeGreaterThan(8)
  })

  test('okresy przechowywania sa para etykieta-wartosc', async ({ page }) => {
    const terminy = page.locator('#czas-przechowywania .policy__terms')
    await expect(terminy).toHaveCount(1)
    expect(await terminy.locator('dt').count()).toBe(6)
    expect(await terminy.locator('dd').count()).toBe(6)
  })

  test('adresy sa klikalne, a godziny kontaktu nie sa wymyslone', async ({ page }) => {
    await expect(
      page.locator('.policy__doc a[href="mailto:kontakt@highfive.academy"]').first(),
    ).toBeVisible()
    await expect(
      page.locator('.policy__doc a[href="mailto:highfive.zapisy@gmail.com"]').first(),
    ).toBeVisible()
  })
})

test.describe('polityka prywatnosci - dokument do pobrania', () => {
  test('przycisk prowadzi do istniejacego pliku PDF', async ({ page, request }) => {
    await page.goto(ADRES)

    const pobierz = page.locator('.policy-hero__pdf')
    await expect(pobierz).toHaveAttribute('download', '')

    const sciezka = await pobierz.getAttribute('href')
    expect(sciezka).toMatch(/\.pdf$/)

    const odpowiedz = await request.get(sciezka)
    expect(odpowiedz.status(), 'plik PDF musi istniec pod podanym adresem').toBe(200)

    /* Naglowek pliku PDF - kontrola, ze to dokument, a nie strona bledu. */
    const naglowek = (await odpowiedz.body()).subarray(0, 5).toString('latin1')
    expect(naglowek).toBe('%PDF-')
  })

  test('PDF jest w repozytorium pod stabilnym adresem', async () => {
    const plik = readFileSync('public/dokumenty/polityka-prywatnosci-high-five-1-0.pdf')
    expect(plik.subarray(0, 5).toString('latin1')).toBe('%PDF-')
  })
})

test.describe('polityka prywatnosci - spis tresci', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(ADRES)
  })

  test('kazda pozycja prowadzi do istniejacej sekcji', async ({ page }) => {
    const cele = await page.evaluate(() =>
      [...document.querySelectorAll('.policy-toc__list a')].map((a) => a.getAttribute('href')),
    )

    expect(cele).toHaveLength(ROZDZIALY.length)
    expect(new Set(cele).size, 'kotwice musza byc unikalne').toBe(cele.length)

    for (const cel of cele) {
      await expect(page.locator(`.policy__section${cel}`)).toHaveCount(1)
    }
  })

  test('spis jest nawigatorem, a nie lista w pudelku', async ({ page }) => {
    const spis = page.locator('.policy-toc')

    /* Zero ramki wokol calosci - par. 7 i decyzja wlasciciela z 19.09.2026. */
    const ramka = await spis.evaluate((el) => {
      const cs = getComputedStyle(el)
      return [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth]
    })
    expect(ramka).toEqual(['0px', '0px', '0px', '0px'])

    /* Zero poziomych kresek miedzy pozycjami - to one robily z tego tabele. */
    const kreski = await page.evaluate(() =>
      [...document.querySelectorAll('.policy-toc__list li')].map(
        (el) => getComputedStyle(el).borderBottomWidth,
      ),
    )
    expect(new Set(kreski)).toEqual(new Set(['0px']))

    /* Za to kazda pozycja niesie fragment pionowej osi. */
    const os = await page.evaluate(() =>
      [...document.querySelectorAll('.policy-toc__list li')].map(
        (el) => getComputedStyle(el).borderLeftWidth,
      ),
    )
    expect(new Set(os)).toEqual(new Set(['1px']))
  })

  test('suwak listy jest ukryty, ale przewijanie dziala', async ({ page }) => {
    const lista = page.locator('.policy-toc__nav')
    await expect(lista).toHaveCSS('scrollbar-width', 'none')

    /* Przy niskim oknie lista musi miec co przewijac. */
    await page.setViewportSize({ width: 1440, height: 760 })
    await page.waitForTimeout(200)

    const maNadmiar = await lista.evaluate((el) => el.scrollHeight > el.clientHeight)
    expect(maNadmiar, 'przy niskim oknie osiemnascie pozycji sie nie miesci').toBe(true)
  })

  test('czytana sekcja jest zaznaczona i ma czerwony odcinek osi', async ({ page }) => {
    await page.locator('#odbiorcy-danych').scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)

    const aktywny = page.locator('.policy-toc__list a[aria-current="true"]')
    await expect(aktywny).toHaveCount(1)
    await expect(aktywny).toHaveCSS('color', 'rgb(242, 59, 47)')

    const znacznik = page.locator('.policy-toc__marker')
    await expect(znacznik).toHaveClass(/is-visible/)
    await expect(znacznik).toHaveCSS('background-color', 'rgb(242, 59, 47)')

    /* Odcinek stoi na wysokosci czytanej pozycji, a nie na poczatku listy. */
    const przesuniecie = await znacznik.evaluate((el) =>
      Number.parseFloat(el.style.translate.split(' ')[1] ?? '0'),
    )
    expect(przesuniecie).toBeGreaterThan(100)
  })

  test('spis dosuwa czytana pozycje do kadru i nie rusza strony', async ({ page }) => {
    /* Niskie okno: lista ma nadmiar, wiec musi sie przewinac sama. */
    await page.setViewportSize({ width: 1440, height: 760 })
    await page.goto(ADRES)

    await page.locator('#zmiany-polityki').scrollIntoViewIfNeeded()
    await page.waitForTimeout(1200)

    const stan = await page.evaluate(() => {
      const lista = document.querySelector('.policy-toc__nav')
      const aktywny = document.querySelector('.policy-toc__list a[aria-current="true"]')
      const kadr = lista.getBoundingClientRect()
      const pozycja = aktywny.getBoundingClientRect()
      return {
        przewinieta: lista.scrollTop,
        widoczna: pozycja.top >= kadr.top - 1 && pozycja.bottom <= kadr.bottom + 1,
      }
    })

    expect(stan.przewinieta, 'lista musi sie dosunac').toBeGreaterThan(0)
    expect(stan.widoczna, 'czytana pozycja musi byc w kadrze spisu').toBe(true)
  })

  test('sticky konczy sie z dokumentem i nie wchodzi na stopke', async ({ page }) => {
    await expect(page.locator('.policy-toc')).toHaveCSS('position', 'sticky')

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(700)

    const kolizja = await page.evaluate(() => {
      const spis = document.querySelector('.policy-toc').getBoundingClientRect()
      const kontakt = document.querySelector('.policy-contact').getBoundingClientRect()
      const stopka = document.querySelector('.site-footer').getBoundingClientRect()
      return { naKontakcie: spis.bottom > kontakt.top + 1, naStopce: spis.bottom > stopka.top + 1 }
    })

    expect(kolizja.naKontakcie).toBe(false)
    expect(kolizja.naStopce).toBe(false)
  })

  test('klikniecie ustawia hash i nie chowa naglowka pod paskiem', async ({ page }) => {
    await page.locator('.policy-toc__list a[href="#facebook"]').click()
    await page.waitForTimeout(1500)

    expect(new URL(page.url()).hash).toBe('#facebook')

    const geometria = await page.evaluate(() => {
      const tytul = document.querySelector('#facebook .policy__title').getBoundingClientRect()
      const naglowek = document.querySelector('.site-header').getBoundingClientRect()
      return { tytulOd: tytul.top, naglowekDo: naglowek.bottom }
    })

    expect(geometria.tytulOd).toBeGreaterThan(geometria.naglowekDo)
  })

  test('na waskim ekranie spis jest zwijany i zamyka sie po wyborze', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(ADRES)
    await page.waitForTimeout(300)

    const spis = page.locator('.policy-toc')
    expect(await spis.evaluate((el) => el.open), 'na telefonie spis startuje zwiniety').toBe(false)

    await page.locator('.policy-toc__summary').click()
    await page.waitForTimeout(300)
    expect(await spis.evaluate((el) => el.open)).toBe(true)

    await page.locator('.policy-toc__list a[href="#facebook"]').click()
    await page.waitForTimeout(600)
    expect(await spis.evaluate((el) => el.open), 'po wyborze lista sie zamyka').toBe(false)

    const poziomy = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(poziomy, 'brak poziomego przewijania').toBe(false)
  })
})

test.describe('polityka prywatnosci - wejscie do strony', () => {
  test('jeden widoczny odnosnik w serwisie: stopka, kolumna Informacje', async ({ page }) => {
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
      ADRES,
    ]

    for (const adres of STRONY) {
      await page.goto(adres)

      const odnosniki = page.locator(`a[href="${ADRES}"]`)
      expect(await odnosniki.count(), `${adres}: dokladnie jeden odnosnik`).toBe(1)

      const gdzie = await odnosniki.evaluate((a) => ({
        wStopce: a.closest('footer') !== null,
        wNaglowku: a.closest('header') !== null,
        kolumna: a.closest('[aria-label]')?.getAttribute('aria-label') ?? null,
      }))

      expect(gdzie.wStopce, `${adres}: odnosnik ma byc w stopce`).toBe(true)
      expect(gdzie.wNaglowku).toBe(false)
      expect(gdzie.kolumna, `${adres}: kolumna Informacje`).toBe('Informacje')
    }
  })

  test('strona nie ma wezwania w naglowku, a menu stoi na swoim miejscu', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    await page.goto('/lokalizacje/')
    const odniesienie = await page
      .locator('.site-nav')
      .evaluate((el) => el.getBoundingClientRect().left)

    await page.goto(ADRES)
    await expect(page.locator('.site-header__cta[href]')).toHaveCount(0)
    await expect(page.locator('.drawer__cta')).toHaveCount(0)

    /*
     * Pasek rozklada dzieci przez space-between, wiec bez przegrodki menu
     * odjechaloby o kilkaset pikseli na prawy skraj. Roznica wzgledem strony
     * z przyciskiem bierze sie tylko z szerokosci etykiety.
     */
    const tutaj = await page.locator('.site-nav').evaluate((el) => el.getBoundingClientRect().left)
    expect(Math.abs(tutaj - odniesienie)).toBeLessThan(40)

    const przegrodka = page.locator('.site-header__cta--slot')
    await expect(przegrodka).toHaveCount(1)
    await expect(przegrodka).toHaveAttribute('aria-hidden', 'true')
    await expect(przegrodka).toHaveCSS('visibility', 'hidden')
  })
})
