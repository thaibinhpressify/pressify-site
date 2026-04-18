<script setup>
import BaseHeader from '../components/header/BaseHeader.vue'
import BaseFooter from '../components/footer/BaseFooter.vue'

const route = useRoute()
const config = useRuntimeConfig()
const { locale } = useI18n()

const siteName = computed(() => String(config.public.siteName || 'Pressify'))
const siteDescription = computed(() => String(config.public.siteDescription || ''))
const siteUrl = computed(() =>
  String(config.public.siteUrl || 'http://localhost:3000')
    .trim()
    .replace(/\/+$/, '')
)

const normalizePathname = (value) => {
  const raw = String(value || '/').trim() || '/'
  if (raw === '/') return '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

const canonicalUrl = computed(() => {
  const base = siteUrl.value
  const pathname = normalizePathname(route.path || '/')
  if (!base) return pathname
  return `${base}${pathname}`
})

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
  ],
}))

useSeoMeta({
  titleTemplate: computed(() => `%s · ${siteName.value}`),
  description: computed(() => siteDescription.value || undefined),
  robots: 'index,follow',
  ogSiteName: siteName,
  ogUrl: canonicalUrl,
  ogType: 'website',
  ogLocale: computed(() => locale.value),
  twitterCard: 'summary_large_image',
  twitterSite: siteName,
})
</script>
<template>
  <div class="min-h-screen w-full">
    <BaseHeader />
    <NuxtPage />
    <BaseFooter />

    <div class="social fixed bottom-[15px] left-[10px] lg:bottom-[50px] lg:left-[20px] z-[1000]">
      <ul class="social__list flex flex-col gap-[15px]">
        <li class="social__item">
          <a href="https://www.facebook.com/group.pressify" target="_blank" rel="noreferrer">
            <img class="w-[34px] h-[34px]" src="/social/facebook.png" alt="facebook">
          </a>
        </li>
        <li class="social__item">
          <a href="https://www.instagram.com/pressify_inc/" target="_blank" rel="noreferrer">
            <img class="w-[34px] h-[34px]" src="/social/instagram.png" alt="instagram">
          </a>
        </li>
        <li class="social__item">
          <div class="dropdown dropdown-top">
            <button type="button" class="p-0" aria-label="Telegram">
              <img class="w-[34px] h-[34px]" src="/social/telegram.webp" alt="telegram">
            </button>

            <ul
              class="dropdown-content menu bg-white shadow-lg rounded-box w-[240px] p-2 border border-black/10"
            >
              <li>
                <a href="https://t.me/long_pressify" target="_blank" rel="noreferrer">
                  Pressify Long Nguyen
                </a>
              </li>
              <li>
                <a href="https://t.me/KunPressify" target="_blank" rel="noreferrer">
                  Kun Pressify
                </a>
              </li>
              <li>
                <a href="https://t.me/pressifysupport247" target="_blank" rel="noreferrer">
                  Support Pressify
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
