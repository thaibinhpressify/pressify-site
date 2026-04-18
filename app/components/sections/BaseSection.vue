<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
<template>
<section class="base-section">
  <div class="container mx-auto px-[15px] lg:px-0">
    <slot name="header"/>
    <slot name="title">
      <div v-show="title" class="base-section__title text-center uppercase">
        {{ title }}
      </div>
    </slot>

    <slot />
  </div>
</section>
</template>

<style lang="scss">
  .base-section {
    padding: 30px 0;
    @media screen and (min-width: 768px) {
      padding: 72px 0;
    }

    &__title {
      height: fit-content;
      color: var(--color-title-section);
      font-weight: 800;
      font-size: 24px;
      line-height: 115%;
      padding: 12px 0;

      @media (min-width: 991px) {
        font-size: 40px;
      }
    }
  }
</style>