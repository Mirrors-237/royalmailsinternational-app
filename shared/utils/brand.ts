const STOP_WORDS = new Set(['of', 'the', 'and', '&', 'de', 'du', 'des', 'la', 'le', 'les', 'et'])

// Initials shown in place of the logo when none has been uploaded (header, share image)
export function brandInitials(siteName: string) {
  return siteName
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w.toLowerCase()))
    .slice(0, 3)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}
