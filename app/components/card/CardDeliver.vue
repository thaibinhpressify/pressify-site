<script setup>
defineProps({
  value: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
})
</script>
<template>
<div class="card-deliver w-full">
  <div class="card-deliver__container">
    <div class="card-deliver__title">
      {{ value }}
    </div>
    <div class="card-deliver__desc">
      {{ desc }}
    </div>
  </div>
</div>
</template>

<style lang="scss">
  .card-deliver {
    border-radius: 16px;
    @apply bg-white;
    transition: all 0.3s ease;
    border: 1px solid transparent;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
      border-color: var(--color-orange);
    }

    &__container {
      padding: 28px;
    }

    &__title {
      font-size: 42px;
      line-height: 42px;
      font-weight: 700;
      @apply text-orange;
    }

    &__desc {
      padding: 6px 0;
      @apply text-gray-100;
    }
  }
</style>