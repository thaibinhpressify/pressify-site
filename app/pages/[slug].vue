<script setup>
import BaseTag from '~/components/tag/BaseTag.vue';
import BreadCrumb from '~/components/header/BreadCrumb.vue'
import { useWpStore } from '~~/stores/wp'

const route = useRoute()
const router = useRouter()
const slug = computed(() => String(route.params.slug || ''))
const wp = useWpStore()
const { locale } = useI18n()

const queryPost =
  'query GetPostBySlug($slug: ID!) {' +
  '\n  post(id: $slug, idType: SLUG) {' +
  '\n    id' +
  '\n    title' +
  '\n    excerpt' +
  '\n    content' +
  '\n    date' +
  '\n    slug' +
  '\n    featuredImage { node { sourceUrl altText } }' +
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

const { data, pending, error } = useAsyncData(
  () => `wp:post:${locale.value}:${slug.value}`,
  async () => {
    if (!slug.value) return { post: null, related: [] }

    const postData = await wp.query(
      queryPost,
      { slug: slug.value },
      { operationName: 'GetPostBySlug' }
    )

    const categoryId = postData?.post?.categories?.nodes?.[0]?.databaseId ?? 0
    let related = []

    if (categoryId) {
      const relatedData = await wp.query(
        queryRelated,
        { first: 3, categoryId },
        { operationName: 'GetRelatedPosts' }
      )

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
  { watch: [slug, locale] }
)

const post = computed(() => data.value?.post ?? null)

// Must run synchronously in setup — do not call after `await useAsyncData`
useWpPostSeo(post, slug)

const categoryLabel = computed(() => post.value?.categories?.nodes?.[0]?.name ?? '')
const breadcrumbItems = computed(() => [
  { label: 'News', to: '/news' },
  { label: post.value?.title || String(slug.value || '') }
])

watch(locale, () => {
  router.replace('/news')
})
</script>

<template>
  <div class="page post bg-white rounded-[0]">
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

          <h1 class="title text-[18px] md:text-[24px] lg:text-[38px] text-black-200">
            {{ post.title }}
          </h1>

          <div class="content wp-content" v-html="post.content"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .post {
    & .title {
      font-size: 24px;
      font-weight: 700;
      @media (min-width: 1024px) {
        line-height: 58px;
      }
    }
  }
</style>
