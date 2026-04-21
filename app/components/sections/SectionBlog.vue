<script setup>
import BaseSection from './BaseSection.vue'
import CardPost from '@/components/card/CardPost.vue'

const localePath = useLocalePath()

const props = defineProps({
  blogs: {
    type: Array,
    default: () => [],
  },
})

const blogs = computed(() => (props.blogs?.length ? props.blogs : []))
</script>
<template>
  <BaseSection class="blog bg-white-200">
    <div class="container mx-auto px-[15px] lg:px-0">
      <div class="blog__header flex justify-between items-center">
        <div class="blog__header-left">
            <div class="blog__status uppercase">
            {{ $t('blog.latest') }}
          </div>

          <h3 class="blog__title uppercase">
            {{ $t('blog.title') }}
          </h3>
        </div>
        <div class="blog__header-right">
          <NuxtLink :to="localePath('/news')" class="btn --outline-primary">{{ $t('blog.view-all') }}</NuxtLink>
        </div>
      </div>

      <div class="blog__list mt-[48px]">
        <div class="grid grid-cols-12 gap-[12px] lg:gap-[28px]">
          <div v-for="blog in blogs" :key="blog.title" class="col-span-12 lg:col-span-4">
            <NuxtLink :to="localePath(`/${blog.slug}`)">
              <CardPost class="h-full" v-bind="blog" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<style lang="scss">
  .blog {
    padding: 48px 0;

    &__status {
      padding: 6px 16px;
      font-size: 12px;
      width: fit-content;
      @apply bg-green-100 text-white rounded-[100px];
    }

    &__title {
      padding: 10px 0;
      font-size: 24px;
      line-height: 120%;
      font-weight: 800;
      @apply text-black-200;

      @media screen and (min-width: 991px) {
        font-size: 40px;
      }
    }
  }
</style>
