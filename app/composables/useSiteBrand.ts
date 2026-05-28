/** Site brand for meta author / publisher (defaults to Pressify). */
export function useSiteBrand() {
  const config = useRuntimeConfig();

  return computed(() => String(config.public.siteName || "Pressify").trim());
}

/** Registers `<meta name="author">` and `<meta name="publisher">`. */
export function useSiteBrandMeta() {
  const brand = useSiteBrand();

  useSeoMeta({
    author: brand,
  });

  useHead({
    meta: [{ name: "publisher", content: brand }],
  });

  return brand;
}
