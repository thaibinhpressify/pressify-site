import { defineStore } from "pinia";
import { useWpStore } from "./wp";
import { useRuntimeConfig } from "nuxt/app";

export type HomeFeedbackAuthor = {
  avatar?: string;
  alt?: string;
  name: string;
  position?: string;
};

export type HomeFeedback = {
  rating: number;
  feedback: string;
  author: HomeFeedbackAuthor;
};

export type HomeNewsItem = {
  thumbnail: string;
  title: string;
  time: string;
  category: string;
  slug: string;
};

export type HomeBanner = {
  title: string;
  content: string;
  bannerVideoUrl: string;
  bannerPosterUrl: string;
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
type AnyRecord = Record<string, unknown>;
const isRecord = (value: unknown): value is AnyRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getIn = (value: unknown, path: Array<string | number>): unknown => {
  let current: unknown = value;
  for (const key of path) {
    if (typeof key === "number") {
      if (!Array.isArray(current)) return undefined;
      current = current[key];
      continue;
    }

    if (!isRecord(current)) return undefined;
    current = current[key];
  }
  return current;
};
const getStringIn = (value: unknown, path: Array<string | number>) => {
  const v = getIn(value, path);
  return typeof v === "string" ? v : "";
};

const toAbsoluteUrl = (baseUrl: string, value: string) => {
  const raw = value.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  const base = baseUrl.trim().replace(/\/$/, "");
  if (!base) return raw.startsWith("/") ? raw : `/${raw}`;
  return raw.startsWith("/") ? `${base}${raw}` : `${base}/${raw}`;
};
const decodeBase64 = (value: string) => {
  if (typeof globalThis.atob === "function") return globalThis.atob(value);
  return Buffer.from(value, "base64").toString("utf8");
};

const toDatabaseId = (value: number | string) => {
  if (typeof value === "number") return value;
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  try {
    const decoded = decodeBase64(trimmed);
    const match = decoded.match(/:(\d+)$/);
    if (match) return Number(match[1]);
  } catch {
    return 0;
  }
  return 0;
};

export const useHomeStore = defineStore("home", {
  state: () => ({
    isLoading: false as boolean,
    error: "" as string,
    feedbacks: [] as HomeFeedback[],
    news: [] as HomeNewsItem[],
    bannerVideoUrl: "" as string,
    bannerPosterUrl: "" as string,
    banner: {
      title: "",
      content: "",
      bannerVideoUrl: "",
      bannerPosterUrl: "",
    } as HomeBanner,
  }),
  actions: {
    async fetchFeedbacks(params?: { categoryId?: number | string; first?: number }) {
      const categoryId = toDatabaseId(params?.categoryId ?? 4);
      const first = params?.first ?? 6;

      const wp = useWpStore();

      this.isLoading = true;
      this.error = "";
      try {
        const data = await wp.query<{
          posts?: {
            nodes?: Array<{
              id: string;
              title?: string | null;
              excerpt?: string | null;
              content?: string | null;
              featuredImage?: { node?: { sourceUrl?: string | null; altText?: string | null } | null } | null;
            }>;
          };
        }>(
          `
            query GetHomeFeedbacks($first: Int!, $categoryId: Int!) {
              posts(
                first: $first
                where: { categoryId: $categoryId }
              ) {
                nodes {
                  id
                  title
                  excerpt
                  content
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
            }
          `,
          { first, categoryId },
          { operationName: "GetHomeFeedbacks" }
        );

        this.feedbacks =
          data.posts?.nodes?.map((p: {
            id: string;
            title?: string | null;
            excerpt?: string | null;
            content?: string | null;
            featuredImage?: { node?: { sourceUrl?: string | null; altText?: string | null } | null } | null;
          }) => {
            const raw = p.excerpt ?? p.content ?? "";
            const feedback = stripHtml(raw);
            const avatar = p.featuredImage?.node?.sourceUrl ?? "";
            const alt = p.featuredImage?.node?.altText ?? "";

            return {
              rating: 5,
              feedback,
              author: {
                avatar,
                alt,
                name: p.title ?? "",
                position: "",
              },
            };
          }) ?? [];
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
        this.feedbacks = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchNews(params?: { categoryId?: number | string; first?: number }) {
      const categoryId = toDatabaseId(params?.categoryId ?? 3);
      const first = params?.first ?? 3;

      const wp = useWpStore();

      this.isLoading = true;
      this.error = "";
      try {
        const data = await wp.query<{
          posts?: {
            nodes?: Array<{
              id: string;
              title?: string | null;
              slug?: string | null;
              date?: string | null;
              featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
              categories?: { nodes?: Array<{ name?: string | null }> };
            }>;
          };
        }>(
          `
            query GetHomeNews($first: Int!, $categoryId: Int!) {
              posts(
                first: $first
                where: {
                  orderby: { field: DATE, order: DESC }
                  categoryId: $categoryId
                }
              ) {
                nodes {
                  id
                  title
                  slug
                  date
                  featuredImage {
                    node {
                      sourceUrl
                    }
                  }
                  categories {
                    nodes {
                      name
                    }
                  }
                }
              }
            }
          `,
          { first, categoryId },
          { operationName: "GetHomeNews" }
        );

        this.news =
          data.posts?.nodes?.map((p) => ({
            thumbnail: p.featuredImage?.node?.sourceUrl ?? "",
            title: stripHtml(p.title ?? ""),
            time: p.date ?? "",
            category: p.categories?.nodes?.[0]?.name ?? "",
            slug: p.slug ?? "",
          })) ?? [];
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
        this.news = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchBanner(params?: { first?: number }) {
      const first = params?.first ?? 1;
      const wp = useWpStore();
      const wpBaseUrl = String(useRuntimeConfig().public.wpBaseUrl || "");

      this.isLoading = true;
      this.error = "";
      try {
        const attempts: Array<{
          operationName: string;
          query: string;
          variables?: Record<string, unknown>;
          pick: (data: AnyRecord) => string;
          pickPoster: (data: AnyRecord) => string;
          pickTitle: (data: AnyRecord) => string;
          pickContent: (data: AnyRecord) => string;
        }> = [
          {
            operationName: "GetHomeBanner1",
            query:
              "query GetHomeBanner1 {\n" +
              "  allBanner {\n" +
              "    nodes {\n" +
              "      title\n" +
              "      content\n" +
              "      featuredImage { node { sourceUrl } }\n" +
              "      videoBanner { urlVideo { node { filePath } } }\n" +
              "    }\n" +
              "  }\n" +
              "}",
            pick: (data: AnyRecord) => {
              const filePath = getStringIn(data, ["allBanner", "nodes", 0, "videoBanner", "urlVideo", "node", "filePath"]);
              return toAbsoluteUrl(wpBaseUrl, filePath);
            },
            pickPoster: (data: AnyRecord) =>
              toAbsoluteUrl(wpBaseUrl, getStringIn(data, ["allBanner", "nodes", 0, "featuredImage", "node", "sourceUrl"])),
            pickTitle: (data: AnyRecord) => getStringIn(data, ["allBanner", "nodes", 0, "title"]),
            pickContent: (data: AnyRecord) => getStringIn(data, ["allBanner", "nodes", 0, "content"]),
          },
          {
            operationName: "GetHomeBanner2",
            query:
              "query GetHomeBanner2($first: Int!) {\n" +
              "  banners(first: $first, where: { orderby: { field: DATE, order: DESC } }) {\n" +
              "    nodes { id title acf { videoBanner { url } } }\n" +
              "  }\n" +
              "}",
            variables: { first },
            pick: (data: AnyRecord) => {
              const url = getIn(data, ["banners", "nodes", 0, "acf", "videoBanner", "url"]);
              return typeof url === "string" ? url : "";
            },
            pickPoster: (_data: AnyRecord) => "",
            pickTitle: (data: AnyRecord) => getStringIn(data, ["banners", "nodes", 0, "title"]),
            pickContent: (_data: AnyRecord) => "",
          },
          {
            operationName: "GetHomeBanner3",
            query:
              "query GetHomeBanner3($first: Int!) {\n" +
              "  banners(first: $first) {\n" +
              "    nodes { id title videoBanner { url } }\n" +
              "  }\n" +
              "}",
            variables: { first },
            pick: (data: AnyRecord) => {
              const url = getIn(data, ["banners", "nodes", 0, "videoBanner", "url"]);
              return typeof url === "string" ? url : "";
            },
            pickPoster: (_data: AnyRecord) => "",
            pickTitle: (data: AnyRecord) => getStringIn(data, ["banners", "nodes", 0, "title"]),
            pickContent: (_data: AnyRecord) => "",
          },
        ];

        let url = "";
        let posterUrl = "";
        let title = "";
        let content = "";
        let lastError: unknown;

        for (const attempt of attempts) {
          try {
            const data = await wp.query<AnyRecord>(attempt.query, attempt.variables, { operationName: attempt.operationName });
            url = attempt.pick(data) || "";
            posterUrl = attempt.pickPoster(data) || "";
            title = attempt.pickTitle(data) || "";
            content = attempt.pickContent(data) || "";
            if (url) break;
          } catch (e) {
            lastError = e;
          }
        }

        if (!url && lastError) throw lastError;

        this.bannerVideoUrl = url;
        this.bannerPosterUrl = posterUrl;
        this.banner = {
          title,
          content,
          bannerVideoUrl: url,
          bannerPosterUrl: posterUrl,
        };
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
        this.bannerVideoUrl = "";
        this.bannerPosterUrl = "";
        this.banner = {
          title: "",
          content: "",
          bannerVideoUrl: "",
          bannerPosterUrl: "",
        };
      } finally {
        this.isLoading = false;
      }
    },
  },
});
