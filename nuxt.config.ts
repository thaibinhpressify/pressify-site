// https://nuxt.com/docs/api/configuration/nuxt-config
import { getGtmInlineScript, getGtmNoscriptHtml, GTM_CONTAINER_ID } from "./app/utils/google-tags";

const gtmId = process.env.NUXT_PUBLIC_GTM_ID || GTM_CONTAINER_ID;
const isDev = process.env.NODE_ENV !== "production";
const wpEndpoint =
  process.env.WP_GRAPHQL_ENDPOINT ||
  process.env.ENDPOINT_WP_GRAPHQL ||
  process.env.NUXT_PUBLIC_WP_GRAPHQL_ENDPOINT ||
  "";

const deriveWpBaseUrl = (endpoint: string) => {
  const trimmed = endpoint.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    if (url.searchParams.has("graphql")) {
      url.search = "";
      return url.toString().replace(/\/$/, "");
    }
    url.search = "";
    url.pathname = url.pathname.replace(/\/graphql\/?$/, "").replace(/\/$/, "");
    return url.toString();
  } catch {
    return "";
  }
};

const wpBaseUrl = process.env.WP_BASE_URL || process.env.NUXT_PUBLIC_WP_BASE_URL || deriveWpBaseUrl(wpEndpoint);
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  runtimeConfig: {
    /** Seller onboarding API (e.g. FastAPI) — POST /sellers */
    sellerApiBase:
      process.env.SELLER_API_BASE || process.env.NUXT_SELLER_API_BASE || "http://localhost:8001",
    pressifyApiBase: process.env.PRESSIFY_API_BASE || process.env.PRESSIFY_API_BASE_URL || "http://localhost:8000",
    wpGraphqlEndpoint: process.env.WP_GRAPHQL_ENDPOINT || process.env.ENDPOINT_WP_GRAPHQL || "",
    wpGraphqlToken: process.env.WP_GRAPHQL_TOKEN || "",
    public: {
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || "",
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || "",
      firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
      firebaseMessagingSenderId:
        process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || "",
      firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
      firebaseVapidKey: process.env.NUXT_PUBLIC_FIREBASE_VAPID_KEY || "",
      pressifyApiBase:
        process.env.NUXT_PUBLIC_PRESSIFY_API_BASE ||
        process.env.NUXT_PUBLIC_PRESSIFY_API_BASE_URL ||
        "http://localhost:8000",
      wpGraphqlEndpoint:
        process.env.NUXT_PUBLIC_WP_GRAPHQL_ENDPOINT || process.env.ENDPOINT_WP_GRAPHQL || "",
      wpBaseUrl,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || "Pressify",
      siteDescription:
        process.env.NUXT_PUBLIC_SITE_DESCRIPTION ||
        "Pressify helps you manage production, shipping, and storefront integrations.",
      gtmId,
    },
  },
  css: [
    "~/assets/scss/main.scss",
    "~/assets/fonts/index.css",
    "animate.css/animate.min.css",
    "swiper/css",
    "swiper/css/effect-creative",
  ],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        },
      ],
      link: [
        {
          rel: "icon",
          href: "/logo.png",
        },
      ],
      script: [
        {
          innerHTML: getGtmInlineScript(gtmId),
          type: "text/javascript",
          tagPriority: "high",
        },
      ],
      noscript: [
        {
          tagPosition: "bodyOpen",
          innerHTML: getGtmNoscriptHtml(gtmId),
        },
      ],
    },
  },
  components: true,
  modules: [
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxt/image",
    "nuxt-swiper",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],

  imports: {
    dirs: ["./stores"],
  },

  nitro: {
    ...(isDev
      ? {}
      : {
        preset: "cloudflare_module",
        cloudflare: {
          deployConfig: true,
          nodeCompat: true,
        },
      }),
  },

  i18n: {
    restructureDir: "app/i18n",
    strategy: "prefix",
    defaultLocale: "en",
    locales: [
      { code: "en", name: "English" },
      { code: "vi", name: "Tiếng Việt" },
    ],
    detectBrowserLanguage: false,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    server: {
      ...(isDev
        ? {
          allowedHosts: ["blog.pressify.us", ".pressify.us"],
        }
        : {}),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/scss/variables/breakpoint" as *;
          `,
        },
      },
    },
  },
});
