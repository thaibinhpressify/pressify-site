<script setup>
defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})
</script>
<template>
  <ul class="menu-footer">
    <li v-for="item in menu" :key="item.path" class="menu-footer__item">
      <nuxt-link :to="item.path">{{ item.name }}</nuxt-link>
    </li>
  </ul>
</template>

<style lang="scss">
  .menu-footer {
    &__item {
      font-size: 16px;
      line-height: 40px;
    }
  }
</style>