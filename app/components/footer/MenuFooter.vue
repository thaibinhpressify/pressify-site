<script setup>
defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})

const localePath = useLocalePath()

const isExternal = (value) => /^https?:\/\//i.test(String(value || ''))
const isHash = (value) => {
  const v = String(value || '')
  return v === '#' || v.startsWith('#')
}
</script>
<template>
  <ul class="menu-footer">
    <li v-for="item in menu" :key="item.path" class="menu-footer__item">
      <a v-if="isExternal(item.path)" :href="item.path" target="_blank" rel="noreferrer">
        {{ item.name }}
      </a>
      <a v-else-if="isHash(item.path)" :href="item.path">
        {{ item.name }}
      </a>
      <NuxtLink v-else :to="localePath(item.path)">
        {{ item.name }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss">
  .menu-footer {
    &__item {
      font-size: 16px;
      line-height: 40px;

      &, & * {
        color: #fff;
      }
    }
  }
</style>
