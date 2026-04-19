<script setup lang="ts">
import HeaderSection from "~/components/sections/HeaderSection.vue";
import { useWpStore } from "~~/stores/wp";

const { locale } = useI18n()

const wp = useWpStore();
const { data: page, pending, error } = await useAsyncData(
  "wp:page:terms",
  async () => {
    return await wp.fetchPageByUri(locale.value === 'en' ? '/terms-of-service/' :`/chinh-sach-bao-mat-dich-vu-pressify/`);
  },
  { watch: [locale], server: false }
);

useSeoMeta({
  title: locale.value === 'en' ? "Terms of Service" : "Chính sách bảo mật Pressify",
  description: locale.value === 'en' ? page?.value?.content || '' : "Read Pressify terms of service.",
  ogTitle: locale.value === 'en' ? "Terms of Service" : "Chính sách bảo mật Pressify",
  ogType: 'article',
  ogImage: page?.value?.featuredImage?.source || '',
  ogDescription: locale.value === 'en' ? page?.value?.content || '' : "Read Pressify terms of service.",
});
</script>

<template>
  <div class="page policy">
    <HeaderSection
      status="Pressify"
      title="Terms of Service"
      desc=""
    />

    <div class="container mx-auto py-[50px]">
      <div v-if="pending">
       <div class="w-full h-[500px] bg-white skeleton"/>
      </div>
      <div v-else-if="error">
        {{ String(error) }}
      </div>
      <div v-else class="wp-content" v-html="page?.content || ''"/>
    </div>
  </div>
</template>
