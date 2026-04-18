<script setup>
import HeaderSection from "~/components/sections/HeaderSection.vue";
import { useWpStore } from "~~/stores/wp";

const { locale } = useI18n();

useSeoMeta({
  title: "About",
  description: "About Pressify.",
  ogTitle: "About",
  ogDescription: "About Pressify.",
  ogImage: "/logo.png",
  ogType: "website",
  ogUrl: `${locale.value}/about/`,
  ogLocale: locale.value,
});

const wp = useWpStore();

const { data, pending, error } = await useAsyncData(
  "wp:page:about",
  async () => {
    return await wp.fetchPageByUri(locale.value === "en" ? "/about/" : "/ve-pressify/");
  },
  { watch: [locale], server: false }
);
</script>

<template>
  <div class="page about">
    <HeaderSection
      status="Pressify"
      :title="$t('about')"
      desc=""
    />

    <div class="bg-white-200">
      <div class="container mx-auto py-[56px]">
        <div v-if="pending" class="about__loading">
         <div class="w-full h-[500px] skeleton rounded-[15px]" />
        </div>
        <div v-else-if="error" class="about__error">
          {{ String(error) }}
        </div>
        <div v-else class="about__content wp-content" v-html="data?.content" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.about {
  &__loading,
  &__error {
    font-size: 14px;
    line-height: 20px;
    color: rgb(0 0 0 / 0.55);
  }

  &__content {
    color: rgb(0 0 0 / 0.7);

    p {
      margin: 12px 0;
      font-size: 16px;
      line-height: 26px;
    }

    h1,
    h2,
    h3 {
      color: var(--color-title-section);
      font-weight: 800;
      margin: 18px 0 10px;
    }

    h1 {
      font-size: 40px;
      line-height: 46px;
    }

    h2 {
      font-size: 32px;
      line-height: 38px;
    }

    h3 {
      font-size: 22px;
      line-height: 28px;
    }
  }
}
</style>
