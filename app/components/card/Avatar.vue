<script setup>
const props = defineProps({
  avatar: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  }
})

const nameAvatar = computed(() => props.name?.split(' ')?.[0] ?? '')


</script>
<template>
<div class="avatar">
  <div class="avatar__container flex items-center justify-center">
    <img v-if="avatar" class="max-w-full h-auto" :src="avatar" :alt="alt">
    <span v-else class="text-white uppercase">{{ nameAvatar }}</span>
  </div>
</div>
</template>

<style lang="scss">
  .avatar {
    width: 44px;
    height: 44px;
    
    @apply rounded-full bg-orange text-white overflow-hidden;
  }
</style>