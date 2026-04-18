<script setup>
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const current = computed(() => String(locale.value || 'en'))
</script>

<template>
  <div class="dropdown dropdown-end">
    <button type="button" class="language-switch__btn" aria-label="Switch language">
      <span class="language-switch__flag">
        <img v-if="current === 'vi'" src="/language/vi.png" alt="">
        <img v-else src="/language/en.png" alt="">
      </span>
      <span class="language-switch__label">
        {{ current.toUpperCase() }}
      </span>
    </button>

    <ul class="dropdown-content menu bg-white shadow-lg rounded-box w-[170px] p-2 border border-black/10">
      <li>
        <NuxtLink :to="switchLocalePath('en')" class="language-switch__item">
          <span class="language-switch__item-code">
            <img class="w-[20px]" src="/language/en.png" alt="">
          </span>
          <span class="text-gray-100">{{ $t("language.en") }}</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="switchLocalePath('vi')" class="language-switch__item">
          <span class="language-switch__item-code">
            <img class="w-[20px]" src="/language/vi.png" alt="">
          </span>
          <span class="text-gray-100">{{ $t("language.vi") }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.language-switch {
  &__btn {
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgb(255 255 255 / 0.25);
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgb(255 255 255 / 0.06);
    color: #fff;
    font-weight: 800;
    font-size: 14px;
  }

  &__btn:hover {
    background: rgb(255 255 255 / 0.1);
  }

  &__flag {
    width: 26px;
    height: 26px;
    border-radius: 999px;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 1px solid rgb(0 0 0 / 0.08);
  }

  &__label {
    letter-spacing: 0.5px;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  &__item-code {
    width: 34px;
    height: 26px;
    border-radius: 10px;
    border: 1px solid rgb(0 0 0 / 0.08);
    background: rgb(0 0 0 / 0.02);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 12px;

    @apply text-gray-100;
  }
}
</style>

