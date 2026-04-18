<template>
  <div class="page contact pb-0">
    <BannerVideo>
      <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div class="container mx-auto">
          <FormContact class="hidden lg:block" />
        </div>
      </div>
    </BannerVideo>

    <div class="container mx-auto p-[15px] py-[30px] lgg:py-[15px] lg:hidden">
      <FormContact class="lg:hidden" />
    </div>
  </div>
</template>
<script setup>
import BannerVideo from "~/components/banner/BannerVideo.vue";
import FormContact from "~/components/form/FormContact.vue";

useSeoMeta({
  title: "Contact",
  description: "Contact Pressify support and sales. We’ll get back to you soon.",
  ogTitle: "Contact",
  ogDescription: "Contact Pressify support and sales. We’ll get back to you soon.",
});
</script>

<style scoped lang="scss">
.contact.page {
  min-height: calc(100vh - 77px);
}
</style>
