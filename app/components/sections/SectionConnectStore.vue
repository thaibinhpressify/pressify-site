<template>
  <BaseSection title="Connect your store and watch the profits roll in">
    <div class="container mx-auto">
      <div class="grid grid-cols-12 gap-[20px]">
        <div
          v-for="card in cards"
          :key="card.title"
          class="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <BaseCard
            class="w-full bg-white"
            :image="card.image"
            :alt="card.alt"
            v-bind="card"
          />
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import BaseSection from "~/components/sections/BaseSection.vue";
import BaseCard from "~/components/card/BaseCard.vue";
import { ref } from "vue";

const cards = ref([
  {
  image: "/card/connect-store.png?v=20260331",
    alt: "Connect Store 1",
    title: "Choose an eCommerce platform",
    desc: "Printify connects with all the big eCommerce platforms and offers custom solutions via our API.",
  },
  {
    image: "/card/product.png?v=20260331",
    alt: "Product",
    title: "Design and publish your products",
    desc: "We offer 900+ products ready to customize and sell – let your creativity run wild!",
  },
  {
    image: "/card/profit.png?v=20260331",
    alt: "Profit",
    title: "Sit back, relax, and profit",
    desc: "Click Publish to post your products to your store. We print and ship. You keep the profits.",
  },
]);
</script>
