<script setup>
defineProps({
  status: {
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
  }
})
</script>
<template>
  <div class="header-section bg-white-100">
    <div class="container mx-auto px-[15px] lg:px-0">
      <div class="header-section__intro">
        <span class="header-section-status text-[13px] uppercase text-orange">
          {{ status }}
        </span>
        <h4 class="header-section__title py-[10px]">
          {{ title }}
        </h4>
        <p class="text-gray-100">
          {{ desc }}
        </p>
      </div>

      <slot />
    </div>
  </div>
</template>

<style lang="scss">
  .header-section {
    padding: 42.5px 0;

    &__title {
      font-size: 24px;
      line-height: 24px;
      font-weight: 700;

      @media (min-width: 991px) {
        font-size: 48px;
        line-height: 48px;
      }
    }

    &__intro {
      padding-left: 16px;
      position: relative;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        @apply bg-orange;
      }
    }
  }
</style>