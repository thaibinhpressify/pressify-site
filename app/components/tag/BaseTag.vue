<script setup>
defineProps({
  tag: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="tag bg-purple">
    {{ tag }}
  </div>
</template>

<style lang="scss">
  .tag {
    width: fit-content;
    font-size: 12px;
    line-height: 15px;
    padding: 8px 12px;
    border-radius: 100px;
    @apply text-white;

  }
</style>
