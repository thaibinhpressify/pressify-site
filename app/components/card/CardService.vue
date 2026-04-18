<script setup>
defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div class="card-service w-full h-full">
    <div class="card-service__container h-full flex flex-col justify-between">
      <div class="card-service__icon flex items-center justify-center">
        <img :src="icon" :alt="title">
      </div>

      <div class="card-service__body">
        <div class="card-service__title">
          {{ title }}
        </div>
        <p class="card-service__desc">
          {{ desc }}
        </p>
      </div>

      <button class="card-service__btn btn --primary mt-[15px]" :href="link">
        {{ $t('learn-more') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
  .card-service {
    background-color: var(--color-white);
    padding: 15px;
    border-radius: 16px;

    @media screen and (min-width: 768px) {
      padding: 32px 28px;
    }

    &__icon {
      width: 52px;
      height: 52px;
      @apply bg-white-100;
      @apply rounded-full;
    }

    &__title {
      padding: 14px 0;
      font-size: 18px;
      line-height: 18px;
      font-weight: 500;
      @apply text-black-200;
    }

    &__desc {
      @apply text-gray-100;
    }
  }
</style>