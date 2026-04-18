<script setup>
import { useMenu } from '@/composables/menu/home'

const { menu } = useMenu()
const localePath = useLocalePath()
</script>

<template>
<ul class="base-menu flex items-center gap-[40px] w-full h-full">
  <li
    v-for="item in menu"
    :key="item.path"
    class="menu__item"
  >
    <NuxtLink
      v-slot="{ isActive, isExactActive }"
      :to="localePath(item.path)"
      class="menu__link"
    >
      <span :class="[(isExactActive || isActive) && 'menu__link--active']">
        {{ item.name }}
      </span>
    </NuxtLink>
  </li>
</ul>
</template>

<style lang="scss">
  .base-menu {
    font-size: 14px;
    color: var(--color-txt-menu);

    .menu__link--active {
      color: var(--color-txt-menu-active);
    }
  }
</style>
