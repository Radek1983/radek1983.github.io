/**
 * Techniczne wsparcie dostepnosci, ktorego nie da sie zrobic samym HTML/CSS.
 *
 * Klasa `js` na <html> pozwala stylom animacyjnym zakladac, ze skrypt wystartowal.
 * Bez niej tresc pozostaje widoczna - awaria JS nie moze niczego trwale ukryc (spec 19.3).
 */

export function initAccessibility() {
  document.documentElement.classList.add('js')
}
