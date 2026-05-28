/** Default Open Graph image path (under `public/`). */
export const DEFAULT_OG_IMAGE_PATH = "/logo.png";

/** Absolute URL for default `og:image` / `twitter:image`. */
export function getDefaultOgImageUrl(siteUrl?: string): string {
  const base = String(siteUrl || "http://localhost:3000")
    .trim()
    .replace(/\/+$/, "");
  return `${base}${DEFAULT_OG_IMAGE_PATH}`;
}

/** Join unique keyword parts into a meta keywords string. */
export function buildMetaKeywords(
  parts: Array<string | null | undefined>,
  fallback = ""
): string {
  const unique = new Set<string>();
  for (const part of parts) {
    const value = String(part ?? "").trim();
    if (value) unique.add(value);
  }
  if (!unique.size) return fallback.trim();
  return Array.from(unique).join(", ");
}

/** Resolve relative or absolute image URL; falls back to default OG image. */
export function resolveOgImageUrl(image: string | undefined, siteUrl?: string): string {
  const trimmed = String(image ?? "").trim();
  if (!trimmed) return getDefaultOgImageUrl(siteUrl);
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = String(siteUrl || "http://localhost:3000")
    .trim()
    .replace(/\/+$/, "");
  return `${base}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}
