<script setup>
import BaseMenu from './BaseMenu.vue'

const { t } = useI18n()
const localePath = useLocalePath()
</script>
<template>
<header class="header py-[21px] px-[15px] lg:px-0">
  <div class="container mx-auto">
    <div class="grid grid-cols-12">
      <div class="col-span-6 lg:col-span-3">
        <NuxtLink :to="localePath('/')">
          <img class="h-[51px]" src="/logo.png" alt="Pressify">
        </NuxtLink>
      </div>

      <div class="hidden lg:block lg:col-span-6">
        <BaseMenu />
      </div>

      <div class="col-span-6 justify-end lg:col-span-3 flex items-center">
        <NuxtLink class="header__btn" :to="localePath('/login')">
          {{ t('seller-login') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</header>
</template>

<style lang="scss">
  .header {
    background-color: var(--color-bg-header);
    @apply text-white;

    &__btn {
      background-color: var(--color-orange);
      padding: 6px 29px 6px 17px;
      border-radius: 8px;
      @apply text-white;
    }
  }
</style>
