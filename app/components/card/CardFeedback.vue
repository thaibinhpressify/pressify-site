<script setup>
import Avatar from './Avatar.vue'
defineProps({
  rating: {
    type: Number,
    default: 5
  },
  feedback: {
    type: String,
    default: ''
  },
  author: {
    type: Object,
    default: () => ({})
  }
})
</script>
<template>
<div class="card feedback bg-white">
  <div class="feedback__container flex flex-col justify-between h-full">
    <div class="feedback__rating ratiting-wrapper">
     <div class="feedback__rating">
        <span v-for="i in rating" :key="i" class="text-orange">★</span>
      </div>
      <p class="feedback__txt" v-html="feedback"/>
    </div>

    <div class="feedback__author flex items-center gap-[12px]">
      <Avatar :avatar="author.avatar" :alt="author.name" />

      <div class="feedback__author-info text-[14px]">
        <span class="feedback__txt-name block w-full">
          {{ author.name }}
        </span>

        <span class="feedback__position-author text-[12px]">
          {{ author.position }}
        </span>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss">
  .feedback {
    padding: 32px 28px;
    border-radius: 16px;
    &__txt {
      font-size: 15px;
      padding: 20px 0;
      @apply text-black-200;
    }

    &__txt-name {
      font-weight: 700;
      @apply text-black-200;
    }

    &__position-author {
      @apply text-gray-100;
    }
  }
</style>