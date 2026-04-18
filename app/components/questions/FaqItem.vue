<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  desc: {
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
  <div class="faq-item bg-white">
    <button class="faq-item__header w-full" type="button" :aria-expanded="isOpen" @click="toggle">
      <div class="faq-item__title">
        {{ title }}
      </div>
      <div class="faq-item__icon" :class="[isOpen && 'faq-item__icon--open']">
        <span v-if="isOpen">−</span>
        <span v-else>+</span>
      </div>
    </button>

    <div v-show="isOpen" class="faq-item__body">
      <div class="faq-item__divider" />
      <div class="faq-item__desc">
        {{ desc }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.faq-item {
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 20px 24px;

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    text-align: left;
  }

  &__title {
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
    color: var(--color-title-section);
  }

  &__icon {
    width: 38px;
    height: 38px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    font-size: 18px;
    line-height: 18px;
    font-weight: 600;
    color: var(--color-orange);
    background-color: rgb(from var(--color-orange) r g b / 0.15);
  }

  &__icon--open {
    color: var(--color-orange);
    background-color: rgb(from var(--color-orange) r g b / 0.15);
  }

  &__body {
    margin-top: 16px;
  }

  &__divider {
    height: 1px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
  }

  &__desc {
    font-size: 16px;
    line-height: 26px;
    color: var(--color-txt-desc-offer);
  }
}
</style>
