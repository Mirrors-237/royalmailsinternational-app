import type { H3Event } from 'h3'
import { mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

// Builds the 1200×630 PNG shown when a page is shared. Social networks do not accept SVG
// or transparent logos well, so the logo is placed on a background in the brand colours:
// - logo for dark backgrounds uploaded → on the dark brand background, like the website header;
// - standard logo only → on a white background;
// - no logo → initials and name, like the website header.

const { width: W, height: H } = SHARE_IMAGE
const NIGHT = '#050b17'
const INK = '#16222c'

type Settings = ShareImageSource & { siteName: string }

const cache = new Map<string, Buffer>()
let fontPaths: Promise<string[]> | undefined

export async function renderShareImage(event: H3Event, settings: Settings): Promise<Buffer> {
  const key = shareImageVersion(settings)
  const cached = cache.get(key)
  if (cached) return cached

  // The logo for dark backgrounds first, then the standard one; initials if neither can be used
  let logo: string | null = null
  let onDark = true
  for (const [path, dark] of [[settings.logoOnDarkUrl, true], [settings.logoUrl, false]] as const) {
    logo = path ? await loadImage(event, path) : null
    if (logo) { onDark = dark; break }
  }

  const svg = buildSvg(settings, { onDark, logo, host: siteOrigin(event).host.replace(/^www\./, '') })
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: W },
    // Text in SVG logos is drawn with the website font when its own font is not available
    font: {
      fontFiles: await loadFonts(),
      loadSystemFonts: false,
      defaultFontFamily: 'Plus Jakarta Sans',
      sansSerifFamily: 'Plus Jakarta Sans',
      serifFamily: 'Plus Jakarta Sans',
      monospaceFamily: 'Plus Jakarta Sans',
    },
  }).render().asPng()

  // Only a few versions are ever needed (the current one, and the previous one while caches expire)
  if (cache.size >= 4) cache.delete(cache.keys().next().value!)
  cache.set(key, png)
  return png
}

function buildSvg(s: Settings, o: { onDark: boolean; logo: string | null; host: string }) {
  const brand = safeHex(s.primaryColor, '#0b5bd3')
  const accent = safeHex(s.accentColor, '#f59e0b')
  const text = o.onDark ? '#ffffff' : INK
  const tagline = wrap(shareImageTagline(s), 46, 2)

  const parts: string[] = []
  let y: number

  if (o.logo) {
    const box = 'x="200" y="120" width="800" height="240" preserveAspectRatio="xMidYMid meet"'
    parts.push(o.logo.startsWith('<') ? `<svg ${box} ${o.logo.slice(4)}` : `<image href="${o.logo}" ${box}/>`)
    y = 452
  } else {
    // Initials tile with the accent dot, as in the website header (components/BrandMark.vue)
    const initials = brandInitials(s.siteName)
    parts.push(
      `<rect x="530" y="70" width="140" height="140" rx="36" fill="url(#og-tile)"/>`,
      `<text x="600" y="160" font-size="${initials.length > 2 ? 46 : 56}" font-weight="800" fill="#fff" text-anchor="middle">${esc(initials)}</text>`,
      `<circle cx="664" cy="76" r="15" fill="${accent}" stroke="${mix(brand, NIGHT, 0.86)}" stroke-width="7"/>`,
    )
    const name = wrap(s.siteName, 22, 2)
    const size = name.length > 1 ? 64 : 76
    name.forEach((line, i) => parts.push(
      `<text x="600" y="${310 + i * (size + 8)}" font-size="${size}" font-weight="800" fill="#fff" text-anchor="middle" letter-spacing="-1.5">${esc(line)}</text>`,
    ))
    y = 310 + name.length * (size + 8) + 24
  }

  tagline.forEach((line, i) => parts.push(
    `<text x="600" y="${y + i * 50}" font-size="38" font-weight="500" fill="${text}" fill-opacity="${o.onDark ? 0.82 : 0.78}" text-anchor="middle">${esc(line)}</text>`,
  ))

  const background = o.onDark
    ? `<rect width="${W}" height="${H}" fill="${mix(brand, NIGHT, 0.86)}"/>
       <rect width="${W}" height="${H}" fill="url(#og-glow)"/>
       <rect width="${W}" height="${H}" fill="url(#og-glow-accent)"/>`
    // Plain white: logos in JPG have a white background of their own
    : `<rect width="${W}" height="${H}" fill="#ffffff"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Plus Jakarta Sans">
  <defs>
    <radialGradient id="og-glow" cx="0.12" cy="0" r="0.95"><stop offset="0" stop-color="${brand}" stop-opacity="0.55"/><stop offset="1" stop-color="${brand}" stop-opacity="0"/></radialGradient>
    <radialGradient id="og-glow-accent" cx="1" cy="1" r="0.6"><stop offset="0" stop-color="${accent}" stop-opacity="0.16"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <linearGradient id="og-tile" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${brand}"/><stop offset="1" stop-color="${mix(brand, NIGHT, 0.7)}"/></linearGradient>
  </defs>
  ${background}
  ${parts.join('\n  ')}
  <text x="600" y="578" font-size="26" font-weight="500" fill="${text}" fill-opacity="0.55" text-anchor="middle">${esc(o.host)}</text>
  <rect y="${H - 12}" width="${W}" height="12" fill="${o.onDark ? accent : brand}"/>
</svg>`
}

// Raster logo as a data URI (resvg does not fetch remote images). An SVG logo is returned as markup
// to be placed inline: as an <image>, its text would be drawn without fonts.
// WebP, accepted for logos before, cannot be read.
async function loadImage(event: H3Event, path: string) {
  const types: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml' }
  const ext = path.split('.').pop()?.toLowerCase() ?? ''
  if (!types[ext]) return null
  try {
    const data = Buffer.from(await $fetch<ArrayBuffer>(apiUrl(event, path), { responseType: 'arrayBuffer', timeout: 5000 }))
    return ext === 'svg' ? inlineSvg(data.toString('utf8')) : `data:${types[ext]};base64,${data.toString('base64')}`
  } catch {
    return null
  }
}

// Root <svg> of the logo (sanitised by the API on upload), with a viewBox so that it scales into its box.
// Returned without its own position and size, starting with "<svg ".
function inlineSvg(markup: string) {
  const start = markup.search(/<svg[\s>]/i)
  const end = markup.lastIndexOf('</svg>')
  if (start < 0 || end < start) return null
  const svg = markup.slice(start, end + 6)
  const open = svg.match(/^<svg([^>]*)>/i)
  if (!open) return null

  const attrs = open[1]!
  const attr = (name: string) => attrs.match(new RegExp(`\\s${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1]
  const viewBox = attr('viewBox') ?? (parseFloat(attr('width') ?? '') && parseFloat(attr('height') ?? '')
    ? `0 0 ${parseFloat(attr('width')!)} ${parseFloat(attr('height')!)}`
    : null)
  if (!viewBox) return null

  // Only embedded images and internal references: the renderer must never read files on the server
  const body = svg.slice(open[0].length).replace(/\s(?:xlink:)?href\s*=\s*("(?!data:|#)[^"]*"|'(?!data:|#)[^']*')/gi, '')
  const kept = attrs.replace(/\s(x|y|width|height|viewBox|preserveAspectRatio)\s*=\s*("[^"]*"|'[^']*')/gi, '')
  return `<svg viewBox="${viewBox}"${kept}>${body}`
}

// resvg reads fonts from files: the server assets are written once to the temporary directory
function loadFonts() {
  fontPaths ??= (async () => {
    const storage = useStorage('assets:server')
    const dir = join(tmpdir(), 'share-image-fonts')
    await mkdir(dir, { recursive: true })
    const keys = (await storage.getKeys('fonts')).filter((k) => k.endsWith('.ttf'))
    return Promise.all(keys.map(async (k) => {
      const file = join(dir, k.split(':').pop()!)
      await writeFile(file, Buffer.from((await storage.getItemRaw(k)) as Uint8Array))
      return file
    }))
  })()
  return fontPaths
}

// Splits text into at most `lines` lines of about `max` characters, with an ellipsis if it is cut
function wrap(text: string, max: number, lines: number) {
  const out: string[] = []
  let line = ''
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (!line) line = word
    else if ((line + ' ' + word).length <= max) line += ' ' + word
    else { out.push(line); line = word }
    if (out.length === lines) break
  }
  if (out.length < lines && line) out.push(line)
  const cut = out.join(' ').length < text.split(/\s+/).filter(Boolean).join(' ').length
  if (cut && out.length) out[out.length - 1] = out[out.length - 1]!.slice(0, max - 1).replace(/[\s,.;:–-]+$/, '') + '…'
  return out
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
