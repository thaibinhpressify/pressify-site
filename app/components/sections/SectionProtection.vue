<template>
  <BaseSection
    class="bg-[#f5f5f0]"
    title="Ensure secure data protection with Pressify"
  >
    <div class="container mx-auto">
      <div class="grid grid-cols-12">
        <div
          v-for="(protection, i) in protections"
          :key="i"
          class="col-span-12 lg:col-span-4"
        >
          <div class="card p-[15px]">
            <div class="card__icon py-[10px]">
              <img class="w-[60px] m-auto" :src="protection.icon" alt="" >
            </div>
            <div class="card__content text-[20px] text-center">
              {{ protection.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import BaseSection from "~/components/sections/BaseSection.vue";

const protections = ref([
  {
    icon: "/card/user.png",
    title: "A trusted partner of Amazon, Etsy, eBay, and TikTok Shop.",
  },
  {
    icon: "/card/shield.png",
    title: "Audited annually by one of the Big Four global accounting firms.",
  },
  {
    icon: "/card/check-circle.png",
    title:
      "The only systems qualified for secure and reliable API integration.",
  },
]);
</script>
