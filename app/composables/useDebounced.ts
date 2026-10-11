// Copy of a ref that only follows it after a pause (search fields)
export function useDebounced<T>(source: Ref<T>, delay = 300) {
  const value = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(source, (v) => {
    clearTimeout(timer)
    timer = setTimeout(() => { value.value = v }, delay)
  })
  onScopeDispose(() => clearTimeout(timer))
  return value
}
