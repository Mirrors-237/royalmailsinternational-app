const HEX = /^#[0-9a-f]{6}$/i

export function safeHex(value: string | undefined, fallback: string) {
  return value && HEX.test(value) ? value : fallback
}

// WCAG 2.x relative luminance
function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}

// Most readable text colour on a given background (brand colours are chosen in the admin)
export function readableOn(background: string, light = '#ffffff', dark = '#16222c') {
  return contrast(background, light) >= contrast(background, dark) ? light : dark
}

// Darkens a colour by mixing it with black (amount between 0 and 1)
export function darken(hex: string, amount: number) {
  const channel = (i: number) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - amount))
  return '#' + [1, 3, 5].map((i) => channel(i).toString(16).padStart(2, '0')).join('')
}

// Brand CSS variables injected on <html>: backgrounds and their matching text colour
export function brandVars(primary: string, accent: string) {
  const brand      = safeHex(primary, '#0b5bd3')
  const acc        = safeHex(accent, '#f59e0b')
  const brandDeep  = darken(brand, 0.3)
  const accentDeep = darken(acc, 0.18)

  return [
    `--brand:${brand}`,       `--on-brand:${readableOn(brand)}`,
    `--brand-deep:${brandDeep}`,   `--on-brand-deep:${readableOn(brandDeep)}`,
    `--accent:${acc}`,        `--on-accent:${readableOn(acc)}`,
    `--accent-deep:${accentDeep}`, `--on-accent-deep:${readableOn(accentDeep)}`,
  ].join(';')
}
