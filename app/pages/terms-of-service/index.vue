<script setup lang="ts">
import HeaderSection from "~/components/sections/HeaderSection.vue";
import TermsCancelTable from "~/components/terms/TermsCancelTable.vue";
import { useWpStore } from "~~/stores/wp";

const { t, locale } = useI18n();

const wp = useWpStore();
const { data: page, pending, error } = await useAsyncData(
  "wp:page:terms",
  async () => {
    return await wp.fetchPageByUri(
      locale.value === "en"
        ? "/terms-of-service/"
        : "/chinh-sach-bao-mat-dich-vu-pressify/"
    );
  },
  { watch: [locale], server: false }
);

const config = useRuntimeConfig();
const defaultOgImage = computed(() =>
  resolveOgImageUrl(page.value?.featuredImage?.source ?? undefined, String(config.public.siteUrl || ""))
);

useSeoMeta({
  title: () => t("tos.pageTitle"),
  description: () => t("tos.pageDesc"),
  ogTitle: () => t("tos.pageTitle"),
  ogType: "article",
  ogImage: defaultOgImage,
  twitterImage: defaultOgImage,
  ogDescription: () => t("tos.pageDesc"),
});
</script>

<template>
  <div class="page policy">
    <HeaderSection
      status="Pressify"
      :title="t('tos.pageTitle')"
      :desc="t('tos.pageDesc')"
    />

    <div class="container mx-auto py-[50px]">
      <TermsCancelTable />
    </div>
  </div>
</template>
