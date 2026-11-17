// Robots that collect content for AI models or SEO tools: no use to the customers, so they are
// shut out entirely. Search engines (Googlebot, Bingbot…) and link previews (WhatsApp, Facebook…)
// stay allowed. Google-Extended and Applebot-Extended are robots.txt names only (no user agent):
// they keep Google and Apple from using the site for AI without removing it from their search.
export const BLOCKED_BOTS = [
  // AI
  'GPTBot', 'ClaudeBot', 'anthropic-ai', 'CCBot', 'Google-Extended', 'Applebot-Extended', 'Bytespider',
  'PerplexityBot', 'meta-externalagent', 'Amazonbot', 'Diffbot', 'cohere-ai', 'ImagesiftBot', 'Timpibot', 'omgili',
  // SEO and data scrapers
  'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'BLEXBot', 'DataForSeoBot',
]

const BLOCKED_UA = new RegExp(BLOCKED_BOTS.map((b) => b.replace(/[-]/g, '\\-')).join('|'), 'i')

export const isBlockedBot = (userAgent: string | undefined) => !!userAgent && BLOCKED_UA.test(userAgent)
