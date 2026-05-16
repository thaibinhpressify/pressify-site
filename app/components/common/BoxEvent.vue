<script setup>
const STORAGE_KEY = 'pressify_box_event_dismissed_date'
import { useHomeStore } from '~~/stores/home'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const home = useHomeStore()

const props = defineProps({
  /** Fallback image if post has no featured image */
  bannerSrc: {
    type: String,
    default: '/logo.png',
  },
})

const show = ref(false)
const route = useRoute()

const activeEvent = computed(() => home.eventBanner[0] ?? null)

const bannerImage = computed(() => {
  const url = activeEvent.value?.featuredImage?.trim()
  return url || props.bannerSrc
})

const postPath = computed(() => {
  const slug = activeEvent.value?.slug
  if (!slug) return '/'
  return `/${slug}`
})

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function readDismissedDate() {
  if (typeof localStorage === 'undefined') return null
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function updateVisibility() {
  const dismissed = readDismissedDate()
  const hasActive = Boolean(activeEvent.value)
  if (route.params.slug === activeEvent.value?.slug) {
    show.value = false
    return;
  };
  show.value = hasActive && dismissed !== todayIso()
}

watch(() => route, () => {
  updateVisibility()
}, { immediate: true, deep: true })

onMounted(() => {
  updateVisibility()
})

watch(activeEvent, () => {
  updateVisibility()
})

function dismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, todayIso())
  } catch {
    /* ignore */
  }
  show.value = false
  if (import.meta.client) {
    trackGtmEvent('box_event_dismiss', { source: 'box_event' })
  }
}
</script>

<template>
  <ClientOnly>
    <Transition name="box-event-fade">
      <div
        v-if="show && activeEvent"
        class="box-event bg-white-100 p-[15px] rounded-[15px] box-shadow pointer-events-none fixed left-1/2 top-[72px] z-[998] flex w-full max-w-[min(92vw,420px)] -translate-x-1/2 justify-center px-3 sm:top-[84px] lg:top-[92px]"
        role="region"
        :aria-label="activeEvent.title"
      >
        <div class="pointer-events-auto relative w-full">
          <button
            type="button"
            class="box-event__close btn btn-circle btn-ghost btn-sm absolute -right-1 -top-1 z-[1] min-h-8 w-8 border border-black/10 bg-white/95 text-black-100 shadow-sm hover:bg-white"
            :aria-label="t('boxEvent.close')"
            @click="dismiss"
          >
            <span class="text-lg leading-none" aria-hidden="true">×</span>
          </button>

          <div class="flex flex-col items-center gap-2 pt-1">
            <span
              class="rounded-full border border-orange/40 bg-orange/15 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-orange"
            >
              {{ t('boxEvent.new') }}
            </span>

            <NuxtLink
              :to="localePath(postPath)"
              class="block w-full max-w-[280px] leading-none"
              @click="trackGtmEvent('box_event_click', { target: 'post', slug: activeEvent.slug })"
            >
              <img
                :src="bannerImage"
                :alt="activeEvent.title"
                class="mx-auto h-auto w-full max-h-[120px] object-contain drop-shadow-md sm:max-h-[340px]"
                width="280"
                height="140"
                loading="lazy"
                decoding="async"
              >
            </NuxtLink>

            <div class="text-center">
              <p class="text-base font-bold leading-snug text-black-100 sm:text-lg">
                {{ activeEvent.title }}
              </p>
            </div>

            <div class="flex gap-[15px]">
              <NuxtLink
              :to="localePath(postPath)"
              class="btn btn-sm border-0 bg-orange px-5 text-white shadow-md hover:bg-orange/90"
              @click="trackGtmEvent('box_event_cta', { target: 'post', slug: activeEvent.slug })"
            >
              {{ t('boxEvent.cta') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/signup?event=' + activeEvent.title)"
              class="btn btn-sm border-0 bg-orange px-5 text-white shadow-md hover:bg-orange/90"
              @click="trackGtmEvent('box_event_cta', { target: 'post', slug: activeEvent.slug })"
            >
              {{ t('signup') }}
            </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
.box-event-fade-enter-active,
.box-event-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.box-event-fade-enter-from,
.box-event-fade-leave-to {
  opacity: 0;
}
</style>
