<script setup>
import moment from 'moment'
defineProps({
  thumbnail: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  }
})
</script>
<template>
<div class="card post bg-white h-full">
  <div class="post__container h-full flex flex-col justify-between">
    <div
      class="post__thumbnail"
      :style="{ backgroundImage: `url(${thumbnail})` }"
    />

    <div class="post__content">
      <div class="post__category">
        {{ category }}
      </div>
      <h4 class="post__title">
        {{ title }}
      </h4>

      <p class="post__time">
        {{  moment(time).format('MMM DD,YYYY') }}
      </p>
    </div>
  </div>
</div>
</template>

<style lang="scss">
.post {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--color-white-200);

  &__thumbnail {
    width: 100%;
    padding-top: 45%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    @apply bg-white-200;
  }
  &__content {
    padding: 20px 24px;
  }

  &__category {
    width: fit-content;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 100px;
    @apply bg-orange text-white uppercase;
  }

  &__title {
    font-size: 16px;
    line-height: 145%;
    font-weight: 700;
    padding: 10px 0;
    @apply text-black-200;
  }

  &__time {
    font-size: 12px;
    @apply text-gray-100;
  }
  
}
</style>