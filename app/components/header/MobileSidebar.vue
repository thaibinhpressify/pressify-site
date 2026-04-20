<script setup>
import { useMenu } from '@/composables/menu/home'
import LanguageSwitch from './LanguageSwitch.vue'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const { menu } = useMenu()
const localePath = useLocalePath()
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    emit('close')
  }
)

const close = () => emit('close')
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="mobile-sidebar">
      <div class="mobile-sidebar__backdrop" @click="close" />
      <div class="mobile-sidebar__panel">
        <div class="mobile-sidebar__header">
          <NuxtLink :to="localePath('/')" class="mobile-sidebar__logo" @click="close">
            <img class="h-[40px]" src="/logo.png" alt="Pressify">
          </NuxtLink>
          <button type="button" class="mobile-sidebar__close" aria-label="Close" @click="close">
            ✕
          </button>
        </div>

        <div class="mobile-sidebar__body">
          <div class="mobile-sidebar__controls">
            <LanguageSwitch />
            <a class="mobile-sidebar__login btn --primary" href="https://pressify.us/login" target="_blank">
              {{ $t('seller-login') }}
            </a>
          </div>

          <nav class="mobile-sidebar__nav">
            <NuxtLink
              v-for="item in menu"
              :key="item.path"
              :to="localePath(item.path)"
              class="mobile-sidebar__link"
              @click="close"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.mobile-sidebar {
  position: fixed;
  inset: 0;
  z-index: 9999;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgb(0 0 0 / 0.45);
  }

  &__panel {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: min(360px, 92vw);
    background: var(--color-bg-header);
    color: #fff;
    border-left: 1px solid rgb(255 255 255 / 0.08);
    box-shadow: -20px 0 70px rgb(0 0 0 / 0.25);
    display: flex;
    flex-direction: column;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 14px;
    border-bottom: 1px solid rgb(255 255 255 / 0.08);
  }

  &__logo {
    display: inline-flex;
    align-items: center;
  }

  &__close {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgb(255 255 255 / 0.2);
    background: rgb(255 255 255 / 0.06);
    color: #fff;
    font-size: 16px;
    font-weight: 800;
  }

  &__body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: auto;
  }

  &__controls {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  &__login {
    width: 100%;
    justify-content: center;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__link {
    width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgb(255 255 255 / 0.12);
    background: rgb(255 255 255 / 0.04);
    font-weight: 800;
    color: #fff;
  }

  &__link:hover {
    background: rgb(255 255 255 / 0.08);
  }
}
</style>

