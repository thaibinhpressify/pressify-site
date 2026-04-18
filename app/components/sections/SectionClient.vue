<script setup>
import BaseSection from './BaseSection.vue'
import CardFeedback from '@/components/card/CardFeedback.vue'

defineProps({
  feedbacks: {
    type: Array,
    default: () => [],
  },
})

const fallbackFeedbacks = [
  {
    rating: 5,
    feedback: '"Working with this team transformed our online presence completely. Revenue up 40% in 3 months!"',
    author: {
      alt: 'SJ',
      name: 'Sarah Johnson',
      position: 'CEO, TechStart'
    }
  },
  {
    rating: 5,
    feedback: "Professional, creative, and always on time. Best agency we've worked with. Highly recommend!",
    author: {
      alt: 'MC',
      name: 'Michael Chen',
      position: 'Founder, GrowthLab'
    }
  },
  {
    rating: 5,
    feedback: '"Our new website gets constant compliments. The team truly understood our vision and delivered."',
    author: {
      alt: 'ED',
      name: 'Emma Davis',
      position: 'Marketing Director'
    }
  }
]

// const feedbacks = computed(() => (props.feedbacks?.length ? props.feedbacks : fallbackFeedbacks))
</script>

<template>
  <BaseSection class="client bg-white-100" :title="$t('client.title')">
    <template #header>
      <div class="client__header">
        {{ $t('client.testimonials') }}
      </div>
    </template>
    <div class="container m-auto lg:mt-[48px] px-[15px] lg:px-0">
      <div class="grid grid-cols-12 gap-[28px]">
        <div v-for="feedback, index in fallbackFeedbacks" :key="index" class="col-span-12 lg:col-span-4">
          <CardFeedback class="h-full" v-bind="feedback" />
        </div>
      </div>
      </div>
  </BaseSection>
</template>

<style lang="scss">
  .client {
    &__header {
      padding: 6px 16px;
      border-radius: 100px;
      font-size: 12px;
      width: fit-content;
      @apply bg-orange text-white uppercase mx-auto;
    }
  }
</style>
