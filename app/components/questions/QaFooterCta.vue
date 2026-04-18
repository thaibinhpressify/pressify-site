<script setup>
const emit = defineEmits(["chat", "email"]);

const props = defineProps({
  emailHref: {
    type: String,
    default: "",
  },
});

const { t } = useI18n();

const onChat = () => emit("chat");
const onEmail = () => {
  if (!props.emailHref) emit("email");
};
</script>

<template>
  <div class="qa-footer-cta bg-white-200">
    <div class="container mx-auto">
      <div class="qa-footer-cta__content">
        <div class="qa-footer-cta__title">
          {{ t("questions.footer_cta.title") }}
        </div>
        <div class="qa-footer-cta__desc">
          {{ t("questions.footer_cta.desc") }}
        </div>

        <div class="qa-footer-cta__actions">
          <button class="btn --primary" type="button" @click="onChat">
            {{ t("questions.footer_cta.chat") }}
          </button>

          <a
            v-if="emailHref"
            class="btn --outline-primary"
            :href="emailHref"
            @click="onEmail"
          >
            {{ t("questions.footer_cta.email") }}
          </a>
          <button v-else class="btn --outline-primary" type="button" @click="onEmail">
            {{ t("questions.footer_cta.email") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.qa-footer-cta {
  padding: 56px 0;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: var(--color-orange);
  }

  &__top {
    height: 2px;
    width: 100%;
    background-color: var(--color-orange);
    margin-bottom: 44px;
  }

  &__content {
    text-align: center;
  }

  &__title {
    font-size: 28px;
    line-height: 34px;
    font-weight: 800;
    color: var(--color-title-section);
  }

  &__desc {
    margin-top: 10px;
    font-size: 14px;
    line-height: 21px;
    color: rgb(0 0 0 / 0.5);
  }

  &__actions {
    margin-top: 18px;
    display: flex;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }
}
</style>
