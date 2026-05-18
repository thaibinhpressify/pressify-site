type WpPostSeoSource = {
  title?: string | null;
  content?: string | null;
  excerpt?: string | null;
  slug?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    } | null;
  } | null;
};

function stripHtml(value: string): string {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

/**
 * Reactive SEO meta for WordPress posts — updates when post data / slug / locale changes.
 */
export function useWpPostSeo(
  post: Ref<WpPostSeoSource | null | undefined>,
  slug: Ref<string>
) {
  const { locale } = useI18n();
  const config = useRuntimeConfig();

  const siteUrl = computed(() =>
    String(config.public.siteUrl || "http://localhost:3000")
      .trim()
      .replace(/\/+$/, "")
  );

  const seoTitle = computed(
    () => post.value?.title?.trim() || slug.value || "Article"
  );

  const seoDescription = computed(() => {
    const fromExcerpt = stripHtml(post.value?.excerpt || "");
    if (fromExcerpt) return truncate(fromExcerpt);
    return truncate(stripHtml(post.value?.content || ""));
  });

  const ogImage = computed(() =>
    resolveOgImageUrl(
      post.value?.featuredImage?.node?.sourceUrl ?? undefined,
      siteUrl.value
    )
  );

  const pagePath = computed(() => {
    const postSlug = post.value?.slug || slug.value;
    return postSlug ? `/${locale.value}/${postSlug}` : `/${locale.value}/${slug.value}`;
  });

  const pageUrl = computed(() => `${siteUrl.value}${pagePath.value}`);

  useSeoMeta({
    title: seoTitle,
    description: seoDescription,
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogType: "article",
    ogUrl: pageUrl,
    ogLocale: locale,
    ogImage,
    ogImageAlt: seoTitle,
    twitterCard: "summary_large_image",
    twitterTitle: seoTitle,
    twitterDescription: seoDescription,
    twitterImage: ogImage,
  });

  return { seoTitle, seoDescription, ogImage, pageUrl };
}
