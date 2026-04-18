<script setup lang="ts">
import HeaderSection from "~/components/sections/HeaderSection.vue";
import { useWpStore } from "~~/stores/wp";

useSeoMeta({
  title: "Privacy Policy",
  description: "Read Pressify privacy policy.",
  ogTitle: "Privacy Policy",
  ogDescription: "Read Pressify privacy policy.",
});

const wp = useWpStore();

const { data: page, pending, error } = await useAsyncData(
  "wp:page:policy",
  async () => {
    return await wp.fetchPageByUri("/policy/");
  },
  { server: false }
);
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
