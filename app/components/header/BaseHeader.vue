<script setup>
import BaseMenu from './BaseMenu.vue'
import LanguageSwitch from './LanguageSwitch.vue'
import MobileSidebar from './MobileSidebar.vue'

const { t } = useI18n()
const localePath = useLocalePath()

const isMobileMenuOpen = ref(false)
const openMobileMenu = () => {
  isMobileMenuOpen.value = true
}
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>
<template>
<header class="header py-[21px] px-[15px] lg:px-0">
  <div class="container mx-auto">
    <div class="grid grid-cols-12">
      <div class="col-span-6 lg:col-span-3">
        <NuxtLink class="header__logo outline-none" :to="localePath('/')">
          <img class="h-[51px]" src="/logo.png" alt="Pressify">
        </NuxtLink>
      </div>

      <div class="hidden lg:block lg:col-span-6">
        <BaseMenu />
      </div>

      <div class="col-span-6 justify-end lg:col-span-3 flex items-center gap-[12px]">
        <button type="button" class="header__burger inline-flex lg:hidden" aria-label="Menu" @click="openMobileMenu">
          <span class="header__burger-line" />
          <span class="header__burger-line" />
          <span class="header__burger-line" />
        </button>

        <div class="hidden lg:flex items-center gap-[12px]">
          <LanguageSwitch />
          <NuxtLink class="header__btn" :to="localePath('/login')">
            {{ t('seller-login') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>

  <MobileSidebar :open="isMobileMenuOpen" @close="closeMobileMenu" />
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

    &__burger {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: 1px solid rgb(255 255 255 / 0.2);
      background: rgb(255 255 255 / 0.06);
      flex-direction: column;
      justify-content: center;
      gap: 6px;
      padding: 0 12px;
    }

    &__burger-line {
      height: 2px;
      width: 100%;
      background: #fff;
      border-radius: 2px;
      opacity: 0.9;
    }
  }
</style>
