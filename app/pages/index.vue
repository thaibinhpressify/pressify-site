<script setup>
import BannerVideo from '@/components/banner/BannerVideo.vue'
import SectionOffer from '@/components/sections/SectionOffer.vue'
import SectionDeliver from '@/components/sections/SectionDeliver.vue'
import SectionClient from '@/components/sections/SectionClient.vue'
import SectionBlog from '@/components/sections/SectionBlog.vue'
import { useHomeStore } from '~~/stores/home'



const { t , locale} = useI18n()

useSeoMeta({
  title: 'Pressify',
  description: 'Print-on-demand operations made simple: production, shipping, and integrations.',
  ogTitle: 'Pressify',
  ogDescription: 'Print-on-demand operations made simple: production, shipping, and integrations.',
})

const home = useHomeStore()

const { pending } = await useAsyncData(
  'home:content',
  async () => {
    await Promise.all([
      home.fetchBanner(),
      home.fetchFeedbacks({ categoryId: 4, first: 3 }),
      home.fetchNews({ categoryId: locale.value === "en" ? 3 : 5, first: 3 }),
    ])
    return true
  },
  { watch: [locale], server: false }
)

const banner = computed(() => home.banner)
</script>
<template>
<div class="page">
  <div class="w-full">
    <div v-if="pending" class="home__loading">
      <div class="w-full h-[520px] lg:h-[650px] bg-[#F5F5F5] rounded-[16px] skeleton" />
      <div class="container mx-auto mt-[28px] px-[15px] lg:px-0">
        <div class="w-full h-[44px] bg-[#F5F5F5] rounded-[10px] skeleton" />
        <div class="mt-[14px] w-full h-[200px] bg-[#F5F5F5] rounded-[16px] skeleton" />
        <div class="mt-[28px] grid grid-cols-12 gap-[18px]">
          <div class="col-span-12 lg:col-span-4 h-[320px] bg-[#F5F5F5] rounded-[16px] skeleton" />
          <div class="col-span-12 lg:col-span-4 h-[320px] bg-[#F5F5F5] rounded-[16px] skeleton" />
          <div class="col-span-12 lg:col-span-4 h-[320px] bg-[#F5F5F5] rounded-[16px] skeleton" />
        </div>
      </div>
    </div>

    <template v-else>
      <BannerVideo class="home__baner" :src="home.bannerVideoUrl || undefined" :poster="home.bannerPosterUrl || undefined">
        <div class="banner__intro absolute w-full top-[20%] lg:bottom-[40px] left-0">
         <div class="container m-auto">
           <div class="home__sologan text-orange text-center m-auto">
            {{ banner.title || 'Pressify' }}
          </div>
          <div class="home__content text-center w-full lg:w-[800px] m-auto">
           <div class="w-full" v-html="banner.content || ''"/>
          </div>

          <div class="home__footer flex gap-[16px] justify-center pt-[24px] pb-[15px]">
            <button class="home__btn btn --primary">
              <span>{{ t('banner.get_started') }}</span>
            </button>
            <button class="home__btn btn">
              <nuxt-link to="/catalog">{{ t('banner.view_catalog') }}</nuxt-link>
            </button>
            </div>
         </div>
        </div>
      </BannerVideo>

      <SectionOffer  />
      <SectionDeliver  />
      <SectionClient :feedbacks="home.feedbacks" />
      <SectionBlog :blogs="home.news" />
    </template>
  </div>
</div>
</template>

<style lang="scss">
  .home {
    &__banner {
      height: calc(100vh - 93px);
    }
    &__sologan {
      padding: 8px 14px;
      background-color: rgb(from var(--color-orange) r g b / 0.15);
      width: fit-content;
      border-radius: 17px
    }

    &__title {
      @apply text-white;
      *, & {
        font-size: 58px;
        line-height: 115%;
        font-weight: 800;
      }
    }

    &__desc {
      font-size: 16px;
      line-height: 26px;
      color: rgb(255 255 255 / 0.6);
    }

    &__btn {
      padding: 16.5px 38px;
      color: var(--color-white);
      border-radius: 16px;
      border: 1.5px solid rgb(255 255 255 / 0.3);
      font-size: 15px;
      list-style: 19px;

      &.\--primary {
        background-color: var(--color-orange);
        border-color: var(--color-orange);
      }
    }


    &__content {
      @media (max-width: 991px) {
        h2 {
          &, & * {
            font-size: 30px;
            line-height: 40px;
          }
        }
      }
    }
  }
</style>
