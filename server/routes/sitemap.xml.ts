type WpGraphqlResponse<TData> = {
  data?: TData;
  errors?: Array<{ message?: string }>;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const normalizeBaseUrl = (value: string) => String(value || "").trim().replace(/\/+$/, "");

const localePath = (locale: string, path: string) => {
  const p = String(path || "/");
  if (p === "/") return `/${locale}`;
  return `/${locale}${p.startsWith("/") ? "" : "/"}${p}`;
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = normalizeBaseUrl(String(config.public.siteUrl || "http://localhost:3000"));

  const locales = ["en", "vi"];
  const staticPaths = ["/", "/catalog", "/news", "/about", "/contact", "/qa", "/questions", "/policy"];
  const now = new Date().toISOString();

  const urls: Array<{ loc: string; lastmod?: string }> = [];
  for (const locale of locales) {
    for (const path of staticPaths) {
      urls.push({
        loc: `${baseUrl}${localePath(locale, path)}`,
        lastmod: now,
      });
    }
  }

  try {
    const query =
      "query SitemapPosts($first: Int!) {\n" +
      "  posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {\n" +
      "    nodes {\n" +
      "      slug\n" +
      "      date\n" +
      "    }\n" +
      "  }\n" +
      "}";

    const result = await $fetch<WpGraphqlResponse<{ posts?: { nodes?: Array<{ slug?: string | null; date?: string | null }> } }>>(
      "/api/wp-graphql",
      {
        method: "POST",
        body: { query, variables: { first: 500 }, operationName: "SitemapPosts" },
      }
    );

    if (result?.errors?.length) {
      throw new Error(result.errors.map((e) => e.message).filter(Boolean).join("\n") || "WPGraphQL error");
    }

    const nodes = result?.data?.posts?.nodes || [];
    for (const node of nodes) {
      const slug = String(node?.slug || "").trim();
      if (!slug) continue;
      for (const locale of locales) {
        urls.push({
          loc: `${baseUrl}${localePath(locale, `/${slug}`)}`,
          lastmod: node?.date || undefined,
        });
      }
    }
  } catch {
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls
      .map((u) => {
        const lastmod = u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : "";
        return `<url><loc>${escapeXml(u.loc)}</loc>${lastmod}</url>`;
      })
      .join("") +
    "</urlset>";

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return xml;
});

