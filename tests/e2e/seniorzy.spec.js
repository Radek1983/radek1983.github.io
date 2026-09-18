import { expect, test } from '@playwright/test'

/**
 * 10 DODATKOWO · ANGIELSKI DLA SENIORÓW — układ zatwierdzony przez właściciela.
 *
 * Sekcja jest ZAPOWIEDZIĄ oferty senioralnej, nie jej katalogiem. Jedna
 * rzecz jest w niej wrażliwa i wynika z wyraźnego polecenia:
 *
 *   - NIGDZIE nie wolno podać granicy wieku. Nazwa oferty zostaje
 *     ("dla seniorów"), ale "60+" i każda inna dolna granica są zakazane:
 *     kurs ma być czytelny także dla osoby po pięćdziesiątce.
 *
 * Czego pilnujemy poza tym:
 *   1. rozpiska poziomow NIE wraca - strona glowna ma jedna linie o nich,
 *   2. kadr Terminalu prawa krawedzia na krawedzi okna,
 *   3. kadr nie jest przycinany - proporcja pudelka rowna proporcji pliku,
 *   4. linia o poziomach i wezwanie stoja tuz pod leadem, niezaleznie od
 *      wysokosci kadru,
 *   5. sekcja nie rosnie ponad budzet wysokosci,
 *   6. zero kart: w sekcji nie ma zaokraglonych prostokatow poza kapsula CTA.
 *
 * Uklad przebudowany 19.09.2026 na polecenie wlasciciela: trzy karty
 * poziomow zeszly na podstrone /oferta/seniorzy/, a tutaj zostala jedna
 * linia informacyjna, wezwanie i dopisek o zapisach w Terminalu.
 *
 * Zmiana któregokolwiek punktu wymaga decyzji właściciela (CLAUDE.md §15, D16).
 */

test.describe('10 seniorzy - uklad zatwierdzony', () => {
  test('nigdzie nie ma granicy wieku', async ({ page }) => {
    await page.goto('/')

    const tekst = await page.locator('#seniorzy').innerText()

    expect(tekst, 'brak "60+"').not.toMatch(/\d\s*\+/)
    expect(tekst, 'brak dolnej granicy wieku').not.toMatch(
      /od\s+\d+\s*(lat|roku)|powyżej\s+\d+|emeryt|osób starszych/i,
    )

    // Nazwa oferty ma zostac - to ona, a nie wiek, opisuje kurs.
    expect(tekst).toMatch(/ANGIELSKI DLA\s+SENIORÓW/i)
  })

  test('rozpiska poziomow nie wraca na strone glowna', async ({ page }) => {
    await page.goto('/')

    /*
     * Karty poziomow zeszly stad 19.09.2026 na podstrone /oferta/seniorzy/.
     * Strona glowna ma byc ZAPOWIEDZIA oferty: jedna linia zamiast katalogu.
     */
    await expect(page.locator('#seniorzy .seniors__level')).toHaveCount(0)
    await expect(page.locator('#seniorzy')).not.toContainText(
      /Początkująca|Podstawowa|Średniozaawansowana/,
    )

    const meta = page.locator('#seniorzy .seniors__meta')
    await expect(meta).toHaveCount(1)
    await expect(meta).toHaveText(/3\s+poziomy · od\s+podstaw do\s+średniozaawansowanego/i)
    await expect(meta).toHaveCSS('text-transform', 'uppercase')
  })

  test('dopisek mowi o zapisach w Terminalu i nie jest przyciskiem', async ({ page }) => {
    await page.goto('/')

    /*
     * Zapisy na te zajecia prowadzi Terminal Kultury, nie High Five. Strona
     * glowna moze o tym powiedziec, ale nie ma czego obiecywac - stad zdanie
     * bez odnosnika i bez drugiego wezwania.
     */
    const nota = page.locator('#seniorzy .seniors__note')
    await expect(nota).toHaveCount(1)
    await expect(nota).toContainText(/Zapisy i\s+szczegóły na\s+stronie Terminala/i)
    await expect(nota.locator('a')).toHaveCount(0)

    // Jedno wezwanie w calej sekcji.
    await expect(page.locator('#seniorzy .cta')).toHaveCount(1)
  })

  test('w sekcji nie ma kart ani zaokraglonych ramek', async ({ page }) => {
    await page.goto('/')

    /*
     * Projekt referencyjny obrysowywal kazdy poziom zaokraglonym prostokatem.
     * Kontrakt (§7) ustawia promien na 0 i dopuszcza kapsule WYLACZNIE dla CTA,
     * a §8 wymienia siatke kart jako anty-wzorzec.
     */
    const winni = await page.evaluate(() =>
      [...document.querySelectorAll('#seniorzy *')]
        .filter((el) => !el.closest('.cta'))
        .filter((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius) > 2)
        .map((el) => (el.className || el.tagName).toString().slice(0, 40)),
    )

    expect(winni).toEqual([])
  })

  test.describe('geometria desktopowa', () => {
    test.skip(({ isMobile }) => isMobile, 'uklad wielokolumnowy dziala od 62rem')

    for (const [width, height] of [
      [1920, 1080],
      [1440, 900],
      [1280, 800],
    ]) {
      test(`kolumny rowne, kadr przy krawedzi okna przy ${width}x${height}`, async ({ page }) => {
        await page.setViewportSize({ width, height })
        await page.goto('/')
        await page.evaluate(() => document.fonts.ready)

        const m = await page.evaluate(() => {
          const kadr = document.querySelector('.seniors__media').getBoundingClientRect()
          const obraz = document.querySelector('.seniors__media img')
          const tekst = document.querySelector('.seniors__intro').getBoundingClientRect()
          const meta = document.querySelector('.seniors__meta').getBoundingClientRect()
          const lead = document.querySelector('.seniors__lead').getBoundingClientRect()
          return {
            odPrawej: Math.round(document.documentElement.clientWidth - kadr.right),
            odstepOdTekstu: Math.round(kadr.left - tekst.right),
            proporcjaKadru: kadr.width / kadr.height,

            /*
             * Proporcja z ATRYBUTOW, nie z `naturalWidth`: kadr jest daleko
             * w dole strony i ma `loading="lazy"`, wiec w chwili pomiaru plik
             * czesto nie jest jeszcze wczytany i wymiary naturalne sa zerowe.
             * Atrybuty niosa te sama liczbe i rezerwuja miejsce w ukladzie.
             */
            proporcjaPliku: Number(obraz.width) / Number(obraz.height),
            metaPodLeadem: Math.round(meta.top - lead.bottom),
          }
        })

        // Prawa krawedz na krawedzi okna - wspolna os ze zdjeciami hero i sekcji 02.
        expect(m.odPrawej, 'kadr przy krawedzi okna').toBeLessThanOrEqual(0)

        /*
         * Kadr jest wezszy od pelnej prawej polowy siatki, wiec miedzy nim
         * a kolumna tekstowa musi zostac widoczna przerwa.
         */
        expect(m.odstepOdTekstu, 'przerwa miedzy tekstem a kadrem').toBeGreaterThanOrEqual(60)

        /*
         * KADR NIE JEST PRZYCINANY. Stala tu proporcja 16:9 wobec 1.45 pliku
         * i `object-fit: cover` zdejmowal gore kadru razem z litera "T" neonu.
         * Wlasciciel zglosil to 19.09.2026 - proporcja pudelka ma sie rownac
         * proporcji zrodla.
         */
        expect(
          Math.abs(m.proporcjaKadru - m.proporcjaPliku),
          `pudelko ${m.proporcjaKadru.toFixed(3)} vs plik ${m.proporcjaPliku.toFixed(3)}`,
        ).toBeLessThan(0.02)

        /*
         * Linia o poziomach stoi TUZ POD LEADEM, a nie pod kadrem. Lewa
         * i prawa kolumna sa osobnymi stosami: wyzszy kadr nie ma prawa
         * spychac tekstu w dol (zgloszenie wlasciciela z 19.09.2026).
         */
        expect(m.metaPodLeadem, 'linia o poziomach tuz pod leadem').toBeLessThanOrEqual(120)
      })
    }

    /*
     * Budzet wysokosci. Kadr o 10% wiekszy dokladal 39 px przy 1440 px -
     * ten prog to wylapie, a jednoczesnie zostawia miejsce na naturalne
     * roznice miedzy przegladarkami.
     */
    test('sekcja nie rosnie ponad budzet wysokosci', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)

      const wysokosc = await page.evaluate(() => document.querySelector('#seniorzy').offsetHeight)

      expect(wysokosc, `sekcja ${wysokosc} px`).toBeLessThanOrEqual(830)
    })
  })

  test('wezwanie prowadzi na podstrone seniorow', async ({ page }) => {
    await page.goto('/')

    const cta = page.locator('#seniorzy .cta')
    await expect(cta).toHaveText(/ZOBACZ ZAJĘCIA DLA SENIORÓW/i)
    await expect(cta).toHaveAttribute('href', '/oferta/seniorzy/')
  })
})
