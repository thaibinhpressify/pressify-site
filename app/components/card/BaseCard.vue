<template>
  <div class="card base-card w-full rounded-[15px] overflow-hidden box-shadow bg-white">
    <div class="card__header">
      <img
        :src="image"
        lazy="image"
        :alt="alt"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      >
    </div>
    <div class="card__content p-[15px]">
      <h4 class="card__title text-[#2f2e0c] text-[17px] py-[5px] font-bold">
        {{ title }}
      </h4>
      <p class="card__desc text-[15px] text-[#666]">{{ desc }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    default: "/card-bg.png",
  },
  alt: {
    type: String,
    default: "Card Image",
  },
  title: {
    type: String,
    default: "Card Title",
  },
  desc: {
    type: String,
    default: "Card Description",
  },
});
</script>

<style lang="scss" scoped>
  .card {
    border: 1px solid #e2e2e2;
  }
</style>