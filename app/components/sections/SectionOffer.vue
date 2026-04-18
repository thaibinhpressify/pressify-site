<script setup>
import { ref } from 'vue'
import BaseSection from '@/components/sections/BaseSection.vue'
import CardService from '@/components/card/CardService.vue'
const services = ref([{
  icon: '/images/ui-ux.png',
  title: 'UI/UX Design',
  desc: 'Beautiful, user-centered designs that convert visitors into customers.',
  link: '#'
},
{
  icon: '/images/web.png',
  title: 'Web Development',
  desc: 'Fast, responsive websites built with modern tech and best practices.',
  link: '#'
},
{
  icon: '/images/seo.png',
  title: 'SEO & Marketting',
  desc: 'Data-driven strategies to boost your organic traffic and leads.',
  link: '#'
},
{
  icon: '/images/e-commerce.png',
  title: 'E-Commerce',
  desc: 'Powerful online stores optimized for sales and conversions.',
  link: '#'
},
])
</script>

<template>
  <BaseSection class="offer" title="What We Offer">
    <template #header>
      <div class="offer__header mx-auto">
        {{ $t('offer.our-service') }}
      </div>
      
    </template>
    <div class="offer">
      <p class="text-center offer__desc">
        {{ $t('offer.desc') }}
      </p>

      <div class="offer__service grid grid-cols-12 gap-[24px] pt-[15px] lg:pt-[48px]">
        <div
          v-for="item, index in services"
          :key="index"
          class="offer__item-service lg:col-span-3 col-span-6"
        >
          <CardService
            :icon="item.icon"
            :title="item.title"
            :desc="item.desc"
            :link="item.link"
          />
        </div>
    </div>
  </div>
</BaseSection>
</template>

<style lang="scss">
  .offer {
    background-color: var(--color-bg-offer);
    &__header {
      padding: 6px 16px;
      border-radius: 100px;
      width: fit-content;
      color: var(--color-white);
      background-color: var(--color-orange);
      @apply uppercase;
    }

    &__desc {
      font-size: 16px;
      line-height: 16px;
      color: var(--color-txt-desc-offer);
    }
  }
</style>