import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

import { CTA, CTA_DOMYSLNE, KONTAKT, LINK_CENNIK, OFFERS } from './src/data/offers.mjs'

const root = import.meta.dirname

/**
 * GitHub Pages nie pozwala ustawiac naglowkow HTTP, wiec CSP dostarczamy znacznikiem meta.
 * Osiagalny podzbior polityki - patrz docs/ADR/0003-naglowki-bezpieczenstwa-na-github-pages.md.
 * `frame-ancestors` jest w meta ignorowane (spec W3C CSP) i celowo go tu nie ma.
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  /*
   * `upgrade-insecure-requests` jest tu SWIADOMIE pominiete.
   *
   * WebKit stosuje te dyrektywe rowniez do 127.0.0.1, w przeciwienstwie do Chrome,
   * ktory wylacza localhost. Przy `vite preview` na http oznaczalo to, ze Safari
   * probowal pobrac arkusz po https i go nie ladowal - testy e2e sprawdzalyby
   * strone bez stylow, niczego nie wykrywajac.
   *
   * Ochrona jest tu zbedna: wszystkie podzasoby maja adresy wzgledne, wiec na
   * produkcji ida po https wymuszonym przez "Enforce HTTPS" w GitHub Pages.
   * Nie ma w projekcie ani jednego absolutnego adresu http.
   *
   * W ops/headers.example.conf dyrektywa pozostaje - tam jest naglowkiem HTTP
   * i nie wplywa na lokalne testy.
   */
].join('; ')

/**
 * Wspoldzielone fragmenty HTML.
 *
 * Strona jest statycznym MPA bez silnika szablonow, a naglowek i stopka sa
 * identyczne na czterech stronach. Bez tego mechanizmu kazda zmiana pozycji
 * w menu wymagalaby czterech identycznych edycji - i predzej czy pozniej
 * strony rozjechalyby sie miedzy soba.
 *
 * Skladnia: <!--#include partials/header.html -->
 *
 * Swiadomie NIE dodajemy tu zaleznosci: to dwadziescia linii, a kazda nowa
 * paczka wymaga uzasadnienia i wpisu w docs/ARCHITECTURE.md (CLAUDE.md par. 10).
 */
function htmlPartials() {
  const WZORZEC = /<!--#include\s+([\w./-]+)\s*-->/g

  /*
   * Lista oferty w mega-menu.
   *
   * Caly modul jest JEDNYM linkiem - numer, etykieta, opis i wezwanie sa
   * spanami w srodku. Dzieki temu klikalna jest cala powierzchnia kolumny,
   * a nie samo czerwone slowo na koncu, i nie powstaje zagniezdzony <a>.
   */
  const megaMenu = (aktywnyUrl) =>
    OFFERS.map((o) => {
      /*
       * Kolumna produktu, ktory uzytkownik wlasnie oglada, zostaje w stanie
       * aktywnym bez najechania. `aria-current="page"` niesie te informacje
       * jednoczesnie do CSS i do czytnika ekranu - nie potrzeba ani klasy
       * modyfikatora, ani JavaScriptu odczytujacego adres w przegladarce.
       *
       * Cztery strony produktowe maja to samo data-section="oferta", wiec
       * sam atrybut na <body> nie odroznilby ich od siebie.
       */
      const biezaca = o.url === aktywnyUrl ? ' aria-current="page"' : ''

      return `          <li class="mega__item">
            <a class="mega__link offer-mark" href="${o.url}"${biezaca}>
              <span class="mega__number offer-mark__number" aria-hidden="true">${o.numer}</span>
              <span class="mega__label offer-mark__label">${o.skrot}</span>
              <span class="mega__desc">${o.opis}</span>
              <span class="mega__meta">${o.kontekst}</span>
              <span class="mega__cta offer-mark__cta"
                >${o.ctaMenu} <span class="offer-mark__arrow" aria-hidden="true">→</span></span
              >
            </a>
          </li>`
    }).join('\n')

  /*
   * Ta sama lista w szufladzie mobilnej. Czterech kolumn nie przenosimy
   * na telefon - zostaje etykieta i jedna linia opisu, zeby wybor byl
   * zrozumialy bez zgadywania.
   */
  const menuMobilne = OFFERS.map(
    (o) => `          <li>
            <a class="drawer__sublink" href="${o.url}">
              <strong>${o.skrot}</strong>
              <span>${o.opis}</span>
            </a>
          </li>`,
  ).join('\n')

  /*
   * I w stopce - ale z wlasna etykieta, nie skrotem z mega-menu.
   * "Dla seniorow" dziala w panelu, gdzie stoi pod numerem i opisem;
   * w kolumnie linkow stopki lepiej niesie sens "Seniorzy 60+", bo prog
   * wiekowy nie ma tam gdzie indziej wybrzmiec.
   */
  const stopkaOferta = OFFERS.map(
    (o) => `      <a class="u-link" href="${o.url}">${o.etykietaStopki}</a>`,
  ).join('\n')

  /*
   * Motyw kolorystyczny naglowka - wariant wspolnego komponentu, nie druga
   * jego kopia.
   *
   * Kariera mowi do innego odbiorcy i ma ciemny akt, wiec naglowek dostaje
   * tam `data-theme="ink"`. Wartosci bierze [data-theme='ink'] z
   * base/variables.css - ta sama definicja, ktorej uzywaja czarne sekcje
   * strony glownej. Markup, uklad, odstepy i animacje zostaja identyczne;
   * zmieniaja sie WYLACZNIE role kolorow.
   */
  const MOTYW_NAGLOWKA = { 'kariera/index.html': ' data-theme="ink"' }

  return {
    name: 'high-five-html-partials',

    /*
     * Kolejnosc deklarowana WYLACZNIE w haku. Ustawienie `enforce: 'pre'`
     * na pluginie razem z `order: 'pre'` rejestrowalo go dwukrotnie:
     * mega-menu wchodzilo do panelu dwa razy i lista miala osiem pozycji
     * zamiast czterech.
     */
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const wynik = html.replace(WZORZEC, (_, sciezka) => {
          const plik = resolve(root, sciezka)
          if (!plik.startsWith(root)) {
            throw new Error(`Fragment poza katalogiem projektu: ${sciezka}`)
          }
          return readFileSync(plik, 'utf8').trimEnd()
        })

        /*
         * Podstawienia po wstawieniu fragmentow, bo to wlasnie one niosa
         * znaczniki. `ctx.filename` jest bezwzgledna sciezka pliku wejsciowego;
         * normalizujemy ja do postaci uzywanej jako klucz w src/data/offers.mjs.
         */
        const klucz = ctx.filename.slice(root.length + 1).replace(/\\/g, '/')
        const cta = klucz in CTA ? CTA[klucz] : CTA_DOMYSLNE

        /*
         * Strona BEZ wezwania w naglowku - wpis `null` w mapie CTA.
         *
         * W SZUFLADZIE blok znika w calosci: pozycje stoja tam w pionie,
         * wiec brak przycisku niczego nie przesuwa.
         *
         * W PASKU zostaje pusta przegrodka. Pasek jest rozkladany przez
         * `justify-content: space-between`, wiec usuniecie przycisku odeslaloby
         * menu na sam prawy skraj - o 460 px dalej niz na pozostalych stronach.
         * Przegrodka niesie etykiete domyslnego wezwania i jest wygaszona
         * `visibility: hidden`, wiec ma DOKLADNIE szerokosc przycisku bez
         * wpisywania jej jako liczby. Zmiana etykiety albo odstepow kapsuly
         * przesunie ja sama.
         *
         * `visibility: hidden` zdejmuje element z drzewa dostepnosci i
         * z kolejnosci focusu, wiec przegrodka nie jest ani klikalna,
         * ani zapowiadana - to sam kawalek miejsca.
         */
        const przegrodka =
          `<span class="cta site-header__cta site-header__cta--slot" aria-hidden="true">` +
          `${CTA_DOMYSLNE.label}<span class="cta__arrow">→</span></span>`

        const bezWezwania = wynik
          .replace(/<!--CTA-PASEK-->[\s\S]*?<!--\/CTA-PASEK-->/g, przegrodka)
          .replace(/[ \t]*<!--CTA-SZUFLADA-->[\s\S]*?<!--\/CTA-SZUFLADA-->\n?/g, '')

        const zWezwaniem = wynik.replace(/[ \t]*<!--\/?CTA-(?:PASEK|SZUFLADA)-->\n?/g, '')

        return (cta === null ? bezWezwania : zWezwaniem)
          .replaceAll('{{MOTYW_NAGLOWKA}}', MOTYW_NAGLOWKA[klucz] ?? '')
          .replaceAll('{{MEGA_MENU}}', megaMenu(`/${klucz.replace(/index\.html$/, '')}`))
          .replaceAll('{{MENU_MOBILNE_OFERTA}}', menuMobilne)
          .replaceAll('{{STOPKA_OFERTA}}', stopkaOferta)
          .replaceAll('{{LINK_CENNIK}}', LINK_CENNIK)
          .replaceAll('{{TEL}}', KONTAKT.telefon)
          .replaceAll('{{TEL_HREF}}', KONTAKT.telefonHref)
          .replaceAll('{{EMAIL}}', KONTAKT.email)
          .replaceAll('{{CTA_LABEL}}', cta?.label ?? '')
          .replaceAll('{{CTA_HREF}}', cta?.href ?? '')
      },
    },
  }
}

/**
 * Wstrzykuje CSP wylacznie do builda. Tryb dev korzysta ze skryptow inline i WebSocketu
 * dla HMR, ktore scisla polityka by zablokowala.
 */
function cspPlugin() {
  return {
    name: 'high-five-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [htmlPartials(), cspPlugin()],

  // User site GitHub Pages (radek1983.github.io) serwuje z korzenia domeny.
  // NIGDY '/radek1983.github.io/' - to wzorzec dla project site i zepsulby wszystkie assety.
  base: process.env.VITE_BASE ?? '/',

  // Brak fallbacku SPA - zgodnie z modelem statycznym i zachowaniem GitHub Pages.
  appType: 'mpa',

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    // Zero data: URI w bundlu. Pozwala utrzymac CSP bez `img-src data:`
    // i daje assetom wlasne, hashowane nazwy plikow.
    assetsInlineLimit: 0,

    // Vite wstrzykuje inline <script> z polyfillem modulepreload.
    // Przy CSP bez 'unsafe-inline' zostalby zablokowany, wiec go wylaczamy.
    // Bezpieczne: kazda przegladarka z macierzy wsparcia obsluguje modulepreload natywnie.
    modulePreload: { polyfill: false },

    sourcemap: mode !== 'production',

    // Vite 8 opiera sie na rolldown - `rollupOptions` jest tylko przestarzalym aliasem.
    rolldownOptions: {
      input: {
        main: resolve(root, 'index.html'),
        notFound: resolve(root, '404.html'),

        /*
         * Kazda podstrona to wlasny katalog z index.html, wiec GitHub Pages
         * serwuje ja pod czystym adresem /dla-seniorow/ bez przepisywania URL.
         */
        // Hub oferty i cztery produkty
        oferta: resolve(root, 'oferta/index.html'),
        ofertaDzieci: resolve(root, 'oferta/dzieci/index.html'),
        ofertaEgzamin: resolve(root, 'oferta/egzamin-osmoklasisty/index.html'),
        ofertaSeniorzy: resolve(root, 'oferta/seniorzy/index.html'),
        ofertaOnline: resolve(root, 'oferta/online/index.html'),

        // Strony pomocnicze i osobna sciezka rekrutacyjna
        lokalizacje: resolve(root, 'lokalizacje/index.html'),
        cennik: resolve(root, 'cennik/index.html'),
        kariera: resolve(root, 'kariera/index.html'),
        polityka: resolve(root, 'polityka-prywatnosci/index.html'),

        /*
         * Stare adresy zostaja jako strony przekierowujace. GitHub Pages nie
         * potrafi odpowiedziec kodem 301 - szczegoly i konsekwencje w ADR 0008.
         */
        starySeniorzy: resolve(root, 'dla-seniorow/index.html'),
        staryOnline: resolve(root, 'online/index.html'),
      },
    },
  },

  // Host przypiety jawnie na IPv4. Domyslny 'localhost' rozwiazuje sie na tej maszynie
  // do IPv6 (::1), a Playwright odpytuje 127.0.0.1 - serwer nigdy nie zostalby uznany za gotowy.
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
}))
