<script setup>
const emit = defineEmits(["live-chat"]);

const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <div class="questions-cta bg-black-200">
    <div class="w-full">
      <div class="questions-cta__card">
        <div class="questions-cta__title">
          {{ t("questions.cta.title") }}
        </div>
        <div class="questions-cta__desc">
          {{ t("questions.cta.desc") }}
        </div>

        <div class="questions-cta__actions">
          <NuxtLink class="btn --primary" :to="localePath('/contact')">
            {{ t("questions.cta.contact_support") }}
          </NuxtLink>
          <button
            class="btn questions-cta__btn-outline"
            type="button"
            @click="emit('live-chat')"
          >
            {{ t("questions.cta.live_chat") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.questions-cta {
  padding: 60px 0;

  &__card {
    border-radius: 18px;
    padding: 34px 24px;
    text-align: center;
  }

  &__title {
    font-size: 28px;
    line-height: 34px;
    font-weight: 800;
    color: var(--color-white);
  }

  &__desc {
    margin-top: 10px;
    font-size: 14px;
    line-height: 21px;
    color: rgb(255 255 255 / 0.6);
  }

  &__divider {
    margin: 18px auto 0;
    height: 1px;
    width: 100%;
    max-width: 820px;
    background-color: rgb(255 255 255 / 0.15);
  }

  &__actions {
    margin-top: 18px;
    display: flex;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  &__btn-outline {
    border-color: rgb(255 255 255 / 0.28);
    color: var(--color-white);
    background-color: transparent;
  }
}
</style>
