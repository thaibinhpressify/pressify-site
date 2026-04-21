<script setup>
import BaseSection from '@/components/sections/BaseSection.vue'
import CardDeliver from '@/components/card/CardDeliver.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const services = ref([
  t('deliver.service.expert'),
  t('deliver.service.transparent'),
  t('deliver.service.ontime'),
  t('deliver.service.dedicated'),
])
const services_value = ref([
  {
    value: t('deliver.value.expert.value'),
    desc: t('deliver.value.expert.desc'),
  },
  {
    value: t('deliver.value.transparent.value'),
    desc: t('deliver.value.transparent.desc'),
  },
  {
    value: t('deliver.value.ontime.value'),
    desc: t('deliver.value.ontime.desc'),
  },
  {
    value: t('deliver.value.dedicated.value'),
    desc: t('deliver.value.dedicated.desc'),
  },
])
</script>
<template>
<BaseSection class="deliver">
  <div class="container mx-auto px-[15px] lg:px-0">
    <div class="grid grid-cols-12">
      <div class="col-span-12 lg:col-span-6">
        <div class="deliver__txt">
          {{ $t('deliver.txt') }}
        </div>
        <h3 class="deliver__title lg:w-[341px]">
          {{ $t('deliver.title') }}
        </h3>
        <p class="deliver__desc">
          {{ $t('deliver.desc') }}
        </p>

        <ul class="deliver__services">
          <li v-for="item in services" :key="item" class="deliver__service flex items-center gap-[10px] py-[10px]">

            <span class="deliver__icon flex items-center justify-center text-[10px] text-center">✓</span>
            {{ item }}
          </li>
        </ul>
      </div>

      <div class="col-span-12 lg:col-span-6">
        <div class="grid grid-cols-2 gap-[12px] lg:gap-[24px]">
          <CardDeliver v-for="(item, index) in services_value" :key="index" v-bind="item" />
        </div>
      </div>
    </div>
  </div>
</BaseSection>
</template>

<style lang="scss">
.deliver {
  background-color: var(--color-bg-deliver);

  &__txt {
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 12px;
    width: fit-content;
    @apply bg-green-100;
    @apply text-white;
  }
  

  &__title {
    padding: 20px 0;
    font-size: 24px;
    line-height: 130%;
    font-weight: 800;

    @media screen and (min-width: 768px) {
      font-size: 38px;
    }
  }

  &__desc {
    @apply text-gray-100;
    font-size: 15px;
  }

  &__icon {
    display: block;
    width: 20px;
    height: 20px;
    background-color: var(--color-orange);
    @apply text-white;
    @apply rounded-full;
  }

  &__services {
    padding: 21px 0;
  }

  &__service {
    font-size: 14px;
  }
}
</style>