<script setup>
import HeaderSection from '~/components/sections/HeaderSection.vue'
import QuestionsSearch from '~/components/questions/QuestionsSearch.vue'
import FaqCategory from '~/components/questions/FaqCategory.vue'
import QuestionsCategoryTabs from '~/components/questions/QuestionsCategoryTabs.vue'
import QaFooterCta from '~/components/questions/QaFooterCta.vue'

import { useQA } from '~/composables/qa'

useSeoMeta({
  title: 'FAQ',
  description: 'Find answers to common questions about Pressify products and services.',
  ogTitle: 'FAQ',
  ogDescription: 'Find answers to common questions about Pressify products and services.',
})

const { activeTab, query, categories, filteredCategories, displayedCategories } = useQA()
</script>
<template>
  <div class="page qa">
    <div class="qa__header bg-white-100">
      <div class="container mx-auto">
      <div class="grid grid-cols-12">
        <div class="col-span-8">
          <HeaderSection status="Help center" title="Frequently Asked Questions" desc="Find answers to common questions about our products and services.">
            <QuestionsSearch v-model="query" class="mt-[24px]" />
          </HeaderSection>  
        </div>
      </div>
    </div>
    </div>

    <QuestionsCategoryTabs v-model="activeTab" class="bg-white-200" :categories="filteredCategories" />

    <div class="qa__body bg-white-100">
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

    <QaFooterCta />
  </div>
</template>
