<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  preview: {
    type: String,
    default: "",
  },
  answer: {
    type: String,
    default: "",
  },
  defaultOpen: {
    type: Boolean,
    default: false,
  },
});

const isOpen = ref(props.defaultOpen);

watch(
  () => props.defaultOpen,
  (value) => {
    isOpen.value = value;
  }
);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="faq-card">
    <button class="faq-card__header" type="button" :aria-expanded="isOpen" @click="toggle">
      <div class="faq-card__title">
        {{ title }}
      </div>
      <div class="faq-card__icon">
        <span v-if="isOpen">−</span>
        <span v-else>+</span>
      </div>
    </button>

    <div v-if="preview" class="faq-card__preview">
      {{ preview }}
    </div>

    <div v-if="isOpen && answer" class="faq-card__answer">
      {{ answer }}
    </div>
  </div>
</template>

<style lang="scss">
.faq-card {
  position: relative;
  border-radius: 16px;
  background-color: var(--color-white);
  padding: 20px 24px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 4px;
    border-radius: 9999px;
    background-color: rgb(from var(--faq-accent, var(--color-orange)) r g b / 0.35);
  }

  &__header {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    text-align: left;
  }

  &__title {
    font-size: 15px;
    line-height: 22px;
    font-weight: 700;
    color: var(--color-title-section);
  }

  &__icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    border-radius: 10px;
    color: var(--faq-accent, var(--color-orange));
    font-size: 20px;
    line-height: 20px;
    font-weight: 700;
  }

  &__preview {
    margin-top: 10px;
    font-size: 14px;
    line-height: 20px;
    color: rgb(0 0 0 / 0.45);
    padding-left: 2px;
  }

  &__answer {
    margin-top: 10px;
    font-size: 14px;
    line-height: 20px;
    color: rgb(0 0 0 / 0.55);
    padding-left: 2px;
  }
}
</style>
