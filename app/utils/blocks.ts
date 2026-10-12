// Image and text blocks placed at fixed spots of the website, edited in the admin (Settings → Image blocks).
// Same model as the API (entities/content-block.ts); the photo is the image slot block-{placement}.
export const BLOCK_PLACEMENTS = {
  home:     { page: 'Home page',     where: 'After "Every way to ship, under one roof"', path: '/' },
  send:     { page: 'Send page',     where: 'After the services, before "Preparing your shipment"', path: '/send' },
  receive:  { page: 'Receive page',  where: 'After "Three things to do"', path: '/receive' },
  business: { page: 'Business page', where: 'After "Why businesses ship with us"', path: '/business' },
  about:    { page: 'About page',    where: 'After "How we work"', path: '/about' },
} as const

export type BlockPlacement = keyof typeof BLOCK_PLACEMENTS
export const BLOCK_PLACEMENT_KEYS = Object.keys(BLOCK_PLACEMENTS) as BlockPlacement[]

export interface ContentBlock {
  enabled: boolean
  title: string
  text: string
  buttonLabel: string
  buttonUrl: string   // a page of the website (/quote) or another website (https://…); empty = no button
  imageAlt: string    // empty = decorative
  imageSide: 'left' | 'right'
}

export const EMPTY_BLOCK: ContentBlock = {
  enabled: false, title: '', text: '', buttonLabel: '', buttonUrl: '', imageAlt: '', imageSide: 'left',
}

// A block is shown when it is switched on and has a photo and a title
export function blockState(settings: Pick<SiteSettings, 'contentBlocks' | 'images'>, placement: BlockPlacement) {
  const block = settings.contentBlocks?.[placement]
  if (!block?.enabled) return 'off' as const
  return block.title.trim() && settings.images?.[`block-${placement}`] ? 'shown' as const : 'incomplete' as const
}
