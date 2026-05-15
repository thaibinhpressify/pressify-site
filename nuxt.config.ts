// https://nuxt.com/docs/api/configuration/nuxt-config
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
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KPF5R79W');`,
          type: "text/javascript",
          tagPriority: "high",
        },
      ],
      noscript: [
        {
          tagPosition: "bodyOpen",
          innerHTML:
            '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KPF5R79W" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
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
