<script setup lang="ts">
import HeaderSection from "~/components/sections/HeaderSection.vue";
import { useWpStore } from "~~/stores/wp";

const { locale } = useI18n()

const wp = useWpStore();
const { data: page, pending, error } = await useAsyncData(
  "wp:page:policy",
  async () => {
    return await wp.fetchPageByUri(locale.value === 'en' ? '/policy/' :`/chinh-sach-bao-mat-pressify/`);
  },
  { watch: [locale], server: false }
);

useSeoMeta({
  title: locale.value === 'en' ? "Privacy Policy" : "Chính sách bảo mật Pressify",
  description: locale.value === 'en' ? page?.value?.content || '' : "Read Pressify privacy policy.",
  ogTitle: locale.value === 'en' ? "Privacy Policy" : "Chính sách bảo mật Pressify",
  ogType: 'article',
  ogImage: page?.value?.featuredImage?.source || '',
  ogDescription: locale.value === 'en' ? page?.value?.content || '' : "Read Pressify privacy policy.",
});
</script>

<template>
  <div class="page policy">
    <HeaderSection
      status="Pressify"
      title="Privacy Policy"
      desc=""
    />

    <div class="container mx-auto py-[50px]">
      <div v-if="pending">
        Loading...
      </div>
      <div v-else-if="error">
        {{ String(error) }}
      </div>
      <div v-else class="wp-content" v-html="page?.content || ''"/>
    </div>
  </div>
</template>
