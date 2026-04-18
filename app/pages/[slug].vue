<script setup>
import BaseTag from '~/components/tag/BaseTag.vue';
import BreadCrumb from '~/components/header/BreadCrumb.vue'
// import CardPost from '~/components/card/CardPost.vue';
import { useWpStore } from '~~/stores/wp'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))
const wp = useWpStore()
const { locale } = useI18n()
const router =  useRouter()
// const localePath = useLocalePath()

const queryPost =
  'query GetPostBySlug($slug: ID!) {' +
  '\n  post(id: $slug, idType: SLUG) {' +
  '\n    id' +
  '\n    title' +
  '\n    content' +
  '\n    date' +
  '\n    slug' +
  '\n    featuredImage { node { sourceUrl } }' +
  '\n    categories { nodes { name databaseId } }' +
  '\n  }' +
  '\n}'

const queryRelated =
  'query GetRelatedPosts($first: Int!, $categoryId: Int!) {' +
  '\n  posts(first: $first, where: { categoryId: $categoryId, orderby: { field: DATE, order: DESC } }) {' +
  '\n    nodes {' +
  '\n      id' +
  '\n      title' +
  '\n      slug' +
  '\n      date' +
  '\n      featuredImage { node { sourceUrl } }' +
  '\n      categories { nodes { name } }' +
  '\n    }' +
  '\n  }' +
  '\n}'

const { data, pending, error } = await useAsyncData(
  'post:by-slug',
  async () => {
    if (!slug.value) return { post: null, related: [] }

    const postData = await wp.query(queryPost, { slug: slug.value }, { operationName: 'GetPostBySlug' })

    const categoryId = postData?.post?.categories?.nodes?.[0]?.databaseId ?? 0
    let related = []

    if (categoryId) {
      const relatedData = await wp.query(queryRelated, { first: 3, categoryId }, { operationName: 'GetRelatedPosts' })

      related =
        relatedData?.posts?.nodes
          ?.filter((p) => (p?.slug ?? '') !== (postData?.post?.slug ?? ''))
          ?.map((p) => ({
            thumbnail: p?.featuredImage?.node?.sourceUrl ?? '',
            title: p?.title ?? '',
            time: p?.date ?? '',
            category: p?.categories?.nodes?.[0]?.name ?? '',
            slug: p?.slug ?? '',
          })) ?? []
    }

    return { post: postData?.post ?? null, related }
  },
  { watch: [slug], server: false }
)

const post = computed(() => data.value?.post ?? null)
const categoryLabel = computed(() => post.value?.categories?.nodes?.[0]?.name ?? '')
const breadcrumbItems = computed(() => [
  { label: 'News', to: '/news' },
  { label: post.value?.title || String(slug.value || '') }
])

const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
const seoTitle = computed(() => post.value?.title || String(slug.value || 'Article'))
const seoDescription = computed(() => {
  const text = stripHtml(post.value?.content || '')
  return text.length > 160 ? `${text.slice(0, 157)}...` : text
})

useSeoMeta(() => ({
  title: seoTitle.value,
  description: seoDescription.value || undefined,
  ogTitle: seoTitle.value,
  ogDescription: seoDescription.value || undefined,
  ogType: 'article',
}))

watch(() => locale.value, () => {
  router.replace('/news')
})
</script>
<template>
  <div class="page post">
    <div class="container mx-auto lg:py-[56px] px-[15px] lg:px-0">
      <div class="post__main">
        <BreadCrumb :items="breadcrumbItems" class="mb-[16px]" />
        <div v-if="pending">
          Loading...
        </div>
        <div v-else-if="error">
          {{ String(error) }}
        </div>
        <div v-else-if="post">
          <div class="page__header flex items-center gap-[10px]">
            <BaseTag v-if="categoryLabel" :tag="categoryLabel" />
          </div>

          <h2 class="title text-[48px] text-black-200">
            {{ post.title }}
          </h2>

          <div class="content wp-content" v-html="post.content"/>
        </div>
      </div>
    </div>

    <!-- <div class="post__related bg-white-200 py-[56px]">
      <div class="container mx-auto">
        <h4 class="post__title-related">
          {{ $t('post.related_articles') }}
        </h4>

        <div class="grid grid-cols-12 gap-[28px]">
          <div v-for="blog in relatedPosts" :key="blog.slug" class="col-span-4">
            <NuxtLink :to="localePath(`/${blog.slug}`)">
              <CardPost class="h-full" v-bind="blog" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss">
  .post {
    & .title {
      font-size: 24px;
      font-weight: 700;
      @media (min-width: 991px) {
        line-height: 58px;
      }
    }
  }
</style>
