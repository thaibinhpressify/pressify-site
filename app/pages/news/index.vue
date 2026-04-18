<script setup>
import PostFull from '~/components/post/PostFull.vue'
import CardPost from '~/components/card/CardPost.vue'
import HeaderSection from '~/components/sections/HeaderSection.vue'
import { useWpStore } from '~~/stores/wp'


const { t, locale } = useI18n()

if (locale.value == 'en') {
  useSeoMeta({
    title: t("news.title"),
    description: t("news.description"),
    ogTitle: 'News',
    ogDescription: 'Latest updates, announcements, and stories from Pressify.',
  })
} else {
  useSeoMeta({
    title: t("news.title"),
    description: t("news.description"),
    ogTitle: t("news.title"),
    ogDescription: t("news.description"),
  })
}
const wp = useWpStore()

const { data } = await useAsyncData(
  'news:category:3',
  async () => {
    const query =
      'query GetNewsByCategory($first: Int!, $categoryId: Int!) {' +
      '\n  posts(first: $first, where: { categoryId: $categoryId, orderby: { field: DATE, order: DESC } }) {' +
      '\n    nodes {' +
      '\n      id' +
      '\n      title' +
      '\n      slug' +
      '\n      excerpt' +
      '\n      date' +
      '\n      featuredImage { node { sourceUrl } }' +
      '\n      categories { nodes { name } }' +
      '\n    }' +
      '\n  }' +
      '\n}'

    const result = await wp.query(
      query,
      { first: 12, categoryId: locale.value == 'en' ? 3 : 5 },
      { operationName: 'GetNewsByCategory' }
    )

    return (
      result?.posts?.nodes?.map((p) => ({
        thumbnail: p?.featuredImage?.node?.sourceUrl ?? '',
        title: p?.title ?? '',
        category: p?.categories?.nodes?.[0]?.name ?? '',
        excerpt: p?.excerpt ?? '',
        time: p?.date ?? '',
        slug: p?.slug ?? ''
      })) ?? []
    )
  },
  { watch: [locale], server: false }
)

const posts = computed(() => data.value ?? [])
const postFirst = computed(() => posts.value?.[0] ?? {})

watch(() => locale.value, () => {
  useSeoMeta({
    title: t("news.title"),
    description: t("news.description"),
    ogTitle: t("news.title"),
    ogDescription: t("news.description"),
  })
})
</script>

<template>
  <div class="news">
    
    <HeaderSection
      status="Pressify"
      :title="t('news.title')"
      :desc="t('news.description')"
    />
    
    <div class="news__menu-wrapper py-[20px] bg-white-200">
      <div class="container mx-auto">
        <ul class="flex news__menu gap-[8px]">
          <li class="news__menu-item --active">
            All
          </li>

          <!-- <li class="news__menu-item">
            New Features
          </li> -->
        </ul>
      </div>
    </div>

    <div class="news__top">
      <div class="container mx-auto lg:py-[40px] px-[15px] lg:px-0">
        <PostFull
          status="New"
          :title="postFirst.title"
          :description="postFirst.description"
          :author="postFirst.author"
          :thumbnail="postFirst.thumbnail"
          :excerpt="postFirst.excerpt"
          :slug="postFirst.slug"
        />
      </div>
    </div>

    <div class="news__main bg-white-200 py-[56px]">
      <div class="container mx-auto px-[15px] lg:px-0">
        <div class="grid grid-cols-12 gap-[24px]">
          <div class="col-span-12">
            <h4 class="news__title-more text-[32px]">
              More Stories
            </h4>
          </div>
          <div v-for="blog in posts" :key="blog.title" class="col-span-12 lg:col-span-4">
            <nuxt-link :to="`/${blog.slug}`">
              <CardPost class="h-full" v-bind="blog" />
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .news {
    &__menu-item {
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 13px;
      line-height: 16px;
      border: 1px solid border-gray-200;
      @apply text-black-200 bg-white;

      &.\--active {
        @apply bg-orange text-white;
      }
    }

    &__title-more {
      font-size: 32px;
      line-height: 32px;
      font-weight: 700;
      @apply text-black-200;
    }
  }
</style>
