<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "search"]);

const { t } = useI18n();

const value = computed({
  get: () => props.modelValue,
  set: (next) => emit("update:modelValue", next),
});

const onSubmit = () => {
  emit("search", value.value);
};
</script>

<template>
  <form class="questions-search" @submit.prevent="onSubmit">
    <div class="questions-search__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm9.7 14.3-3.2-3.2"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <input
      v-model="value"
      class="questions-search__input"
      type="text"
      :placeholder="t('questions.search.placeholder')"
    />

    <button class="questions-search__btn" type="submit">
      {{ t("questions.search.button") }}
    </button>
  </form>
</template>

<style lang="scss">
.questions-search {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 14px;
  padding: 10px 12px;
  background-color: var(--color-white);
  border: 1.5px solid rgb(0 0 0 / 0.08);

  &__icon {
    width: 20px;
    height: 20px;
    color: rgb(0 0 0 / 0.45);
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__input {
    flex: 1 1 auto;
    height: 44px;
    outline: none;
    background: transparent;
    font-size: 16px;
    line-height: 20px;
    color: var(--color-title-section);
  }

  &__btn {
    height: 44px;
    padding: 0 28px;
    border-radius: 12px;
    background-color: var(--color-orange);
    color: var(--color-white);
    font-size: 16px;
    line-height: 16px;
    font-weight: 600;
    flex: none;
  }
}
</style>
