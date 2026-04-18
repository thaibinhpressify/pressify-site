<script setup>
import moment from 'moment'
defineProps({
  status: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  excerpt: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    default: ''
  }
})
</script>
<template>
<div class="grid grid-cols-12 gap-[15px] p-[15px] lg:p-0 lg:gap-[48px] post-full">
  <div class="col-span-12 lg:col-span-5">
    <div
      class="post-full__thumbnail"
      :style="{
        backgroundImage: `url(${thumbnail})`
      }"
    />
    </div>

  <div class="col-span-12 lg:col-span-7 flex flex-col gap-[16px] justify-between">
    <div class="post__status">
      <span class="bg-orange text-white px-[8px] rounded-[100px]">
       {{ status }}
      </span>
    </div>
    <h3 class="post-full__title">
      {{ title }}
    </h3>
    <p class="text-gray-100" v-html="excerpt"/>

    <div class="post__time-wrapper text-gray-100 flex items-center gap-[16px]">
      <span>
        {{ moment().format('MMM DD, YYYY') }}
      </span>

      <span class="author">
        {{ author }}
      </span>
    </div>

    <NuxtLink
      :to="`/${slug}`"
      class="btn --primary post-full__btn">
      {{ $t('post.read') }}
    </NuxtLink>
  </div>
</div>
</template>

<style lang="scss">
  .post-full {
    &__thumbnail {
      padding-top: 69.5%;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      border-radius: 16px;
      overflow: hidden;
      @apply bg-white-100;
    }

    &__title {
      font-size: 34px;
      line-height: 125%;
      font-weight: 700;
    }


    &__btn {
      width: fit-content;
    }
  }
</style>