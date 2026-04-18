<template>
  <div class="qa questions bg-white-100">
   <div class="container mx-auto px-[15px] lg:px-0">
     <QuestionsCategoryTabs v-model="activeTab"  :categories="filteredCategories" />

    <div class="qa__body">
      <div class="container mx-auto py-[40px]">
        <div
          v-for="c in displayedCategories"
          :id="`qa-${toAnchor(c.title)}`"
          :key="c.title"
          class="mb-[44px]"
        >
          <FaqCategory :title="c.title" :accent="c.accent" :items="c.items" />
        </div>
      </div>
    </div>
   </div>
  </div>
</template>

<script setup>
import QuestionsCategoryTabs from "~/components/questions/QuestionsCategoryTabs.vue";
import FaqCategory from "~/components/questions/FaqCategory.vue";
import { useQA } from '~/composables/qa'

const { activeTab, filteredCategories, displayedCategories, toAnchor } = useQA()
</script>

<style lang="scss">
.faq {
  &__item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }

  &__item:last-child {
    border-bottom: 0;
  }

  &__trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 18px 18px;
    text-align: left;
    background: transparent;
  }

  &__title {
    font-size: 22px;
    line-height: 1.25;
    font-weight: 700;
    color: #1a1a1a;
  }

  &__trigger.is-open .faq__title {
    color: var(--color-primary);
  }

  &__icon {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.55);
    transition:
      transform 200ms ease,
      color 200ms ease;
  }

  &__trigger.is-open .faq__icon {
    color: var(--color-primary);
  }

  &__panel {
    padding: 0 18px 18px;
  }

  &__content {
    color: rgba(0, 0, 0, 0.7);
    font-size: 15px;
    line-height: 1.8;
  }
}

@media screen and (min-width: 991px) {
  .faq {
    &__trigger {
      padding: 20px 22px;
    }

    &__panel {
      padding: 0 22px 22px;
    }

    &__title {
      font-size: 26px;
    }
  }
}
</style>
