// Website photos in use: the one uploaded in the admin, otherwise the built-in one
export function useMedia() {
  const settings = useSiteSettings()
  return computed(() => {
    const uploaded = settings.value.images ?? {}
    return Object.fromEntries(
      (Object.keys(MEDIA) as MediaSlot[]).map((slot) => [
        slot,
        uploaded[slot] ? { src: `/api${uploaded[slot]}`, alt: MEDIA[slot].alt } : MEDIA[slot],
      ]),
    ) as unknown as Record<MediaSlot, SiteImage>
  })
}
