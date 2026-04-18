<script setup>
import FaqCategoryItem from "./FaqCategoryItem.vue";

defineProps({
  title: {
    type: String,
    default: "",
  },
  accent: {
    type: String,
    default: "var(--color-orange)",
  },
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="faq-category" :style="{ '--faq-accent': accent }">
    <div class="faq-category__header">
      <span class="faq-category__dot" />
      <div class="faq-category__title">
        {{ title }}
      </div>
    </div>

    <div class="faq-category__list">
      <FaqCategoryItem
        v-for="(item, index) in items"
        :key="`${index}-${item.title}`"
        :title="item.title"
        :preview="item.preview"
        :answer="item.answer"
      />
    </div>
  </div>
</template>

<style lang="scss">
.faq-category {
  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 9999px;
    background-color: var(--faq-accent, var(--color-orange));
    flex: none;
  }

  &__title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    color: var(--color-title-section);
  }

  &__list {
    display: grid;
    gap: 14px;
  }
}
</style>
