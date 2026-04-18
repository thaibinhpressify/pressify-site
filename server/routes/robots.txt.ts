export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const baseUrl = String(config.public.siteUrl || "http://localhost:3000").trim().replace(/\/+$/, "");
  const body = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`;
  setHeader(event, "content-type", "text/plain; charset=utf-8");
  return body;
});

