<script setup>
defineProps({
  modelValue: {
    type: String,
    default: "all",
  },
  categories: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const { t } = useI18n();

const setValue = (value) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <div class="questions-tabs bg-white-100">
    <div class="container mx-auto px-[15px] lg:px-0">
      <div class="questions-tabs__row">
        <button
          type="button"
          class="questions-tabs__tab"
          :class="[modelValue === 'all' && 'questions-tabs__tab--active']"
          @click="setValue('all')"
        >
          {{ t("questions.tabs.all") }}
        </button>

        <button
          v-for="category in categories"
          :key="category.title"
          type="button"
          class="questions-tabs__tab"
          :class="[modelValue === category.title && 'questions-tabs__tab--active']"
          @click="setValue(category.title)"
        >
          {{ category.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.questions-tabs {
  border-top: 1px solid rgb(0 0 0 / 0.06);
  border-bottom: 1px solid rgb(0 0 0 / 0.06);
  padding: 14px 0;

  &__row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
  }

  &__tab {
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid rgb(0 0 0 / 0.08);
    background-color: var(--color-white);
    color: rgb(0 0 0 / 0.6);
    font-size: 13px;
    line-height: 16px;
    font-weight: 600;
    white-space: nowrap;
  }

  &__tab--active {
    background-color: var(--color-orange);
    border-color: var(--color-orange);
    color: var(--color-white);
  }
}
</style>
