import { defineStore } from "pinia";
import { useNuxtApp } from "nuxt/app";

export type WpPost = {
  id: string;
  title: string;
  slug: string;
  date?: string | null;
};

export type WpPage = {
  id: string;
  title: string;
  uri: string;
  content: string;
  featuredImage: {
    source: string | null;
  };
};

export type WpTaxonomy = "CATEGORY" | "POST_TAG" | "TAG" | "category" | "post_tag" | "tag";

type WpGqlFn = <TData>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { operationName?: string }
) => Promise<TData>;

const normalizePageUri = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "/";
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
};

const normalizeTaxonomy = (value: WpTaxonomy) => {
  const v = String(value).toLowerCase();
  if (v === "category") return "CATEGORY";
  if (v === "tag" || v === "post_tag") return "POST_TAG";
  return String(value);
};

export const useWpStore = defineStore("wp", {
  state: () => ({
    isLoading: false as boolean,
    error: "" as string,
    posts: [] as WpPost[],
    pagesByUri: {} as Record<string, WpPage>,
  }),
  actions: {
    async query<TData>(query: string, variables?: Record<string, unknown>, options?: { operationName?: string }) {
      const { $wpGql } = useNuxtApp() as unknown as { $wpGql: WpGqlFn };
      return await $wpGql<TData>(query, variables, options);
    },
    async fetchPosts(first = 10) {
      this.isLoading = true;
      this.error = "";
      try {
        const data = await this.query<{
          posts?: { nodes?: Array<{ id: string; title?: string | null; slug?: string | null; date?: string | null }> };
        }>(
          `
            query GetPosts($first: Int!) {
              posts(first: $first) {
                nodes {
                  id
                  title
                  slug
                  date
                }
              }
            }
          `,
          { first },
          { operationName: "GetPosts" }
        );

        this.posts =
          data.posts?.nodes?.map((p: { id: string; title?: string | null; slug?: string | null; date?: string | null }) => ({
            id: p.id,
            title: p.title ?? "",
            slug: p.slug ?? "",
            date: p.date ?? null,
          })) ?? [];
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
        this.posts = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPostsByTaxonomy(params: { taxonomy: WpTaxonomy; termId: number; first?: number }) {
      const taxonomy = normalizeTaxonomy(params.taxonomy);
      const first = params.first ?? 10;

      this.isLoading = true;
      this.error = "";
      try {
        const data = await (async () => {
          if (taxonomy === "CATEGORY") {
            return await this.query<{
              posts?: { nodes?: Array<{ id: string; title?: string | null; slug?: string | null; date?: string | null }> };
            }>(
              `
                query GetPostsByCategory($first: Int!, $categoryId: Int!) {
                  posts(first: $first, where: { categoryId: $categoryId }) {
                    nodes {
                      id
                      title
                      slug
                      date
                    }
                  }
                }
              `,
              { first, categoryId: params.termId },
              { operationName: "GetPostsByCategory" }
            );
          }

          if (taxonomy === "POST_TAG") {
            return await this.query<{
              posts?: { nodes?: Array<{ id: string; title?: string | null; slug?: string | null; date?: string | null }> };
            }>(
              `
                query GetPostsByTag($first: Int!, $tagId: Int!) {
                  posts(first: $first, where: { tagId: $tagId }) {
                    nodes {
                      id
                      title
                      slug
                      date
                    }
                  }
                }
              `,
              { first, tagId: params.termId },
              { operationName: "GetPostsByTag" }
            );
          }

          throw new Error(
            `This WPGraphQL schema does not support taxQuery for posts. Supported filters: categoryId, tagId. Received taxonomy: ${taxonomy}`
          );
        })();

        this.posts =
          data.posts?.nodes?.map((p: { id: string; title?: string | null; slug?: string | null; date?: string | null }) => ({
            id: p.id,
            title: p.title ?? "",
            slug: p.slug ?? "",
            date: p.date ?? null,
          })) ?? [];
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
        this.posts = [];
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPostsByCategoryId(categoryId: number, first = 10) {
      return await this.fetchPostsByTaxonomy({ taxonomy: "CATEGORY", termId: categoryId, first });
    },

    async fetchPostsByTagId(tagId: number, first = 10) {
      return await this.fetchPostsByTaxonomy({ taxonomy: "POST_TAG", termId: tagId, first });
    },

    async fetchPageByUri(uri: string) {
      const normalized = normalizePageUri(uri);
      const cached = this.pagesByUri[normalized];
      if (cached) return cached;

      this.isLoading = true;
      this.error = "";
      try {
        const data = await this.query<{
          page?: { id: string; title?: string | null; uri?: string | null; content?: string | null; featuredImage?: { node?: { sourceUrl?: string | null } } };
        }>(
          `
            query GetPage($id: ID!) {
              page(id: $id, idType: URI) {
                id
                title
                uri
                content,
                featuredImage { node { sourceUrl } }
              }
            }
          `,
          { id: normalized },
          { operationName: "GetPage" }
        );

        const page: WpPage = {
          id: data.page?.id ?? "",
          title: data.page?.title ?? "",
          uri: data.page?.uri ?? normalized,
          content: data.page?.content ?? "",
          featuredImage: { source: data.page?.featuredImage?.node?.sourceUrl ?? "" },
        };

        this.pagesByUri[normalized] = page;
        return page;
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
