<template>
  <BaseSection class="optimize">
    <div class="container mx-auto py-[10px] lg:py-[25px]">
      <div class="grid grid-cols-10 gap-[15px]">
        <div class="col-span-10">
          <h4
            class="optimize__sub-title text-center text-[18px] lg:text-[20px]"
          >
            <span class="text-[#2f2e0c]"> Join over </span>
            <span class="text-[#257c25]">+10 million</span> people selling with
            Pressify
          </h4>
          <h3
            class="optimize__title font-bold text-[#4c5c4c] text-[25px] lg:text-[36px] text-center my-[10px] lg:my-[20px]"
          >
            Optimize sales operations on the platform
          </h3>
          <p class="text-center">
            Already a seasoned pro with your own website? Take advantage of our
            custom API solutions.
          </p>
        </div>
        <div
          v-for="optimize in optimizes"
          :key="optimize.value"
          class="col-span-5 lg:col-span-2"
        >
          <div class="optimize__card card p-[15px]">
            <h4
              class="optimize__card-title text-[36px] optimize__gradient py-[15px] text-center"
            >
              {{ optimize.value }}
            </h4>
            <p class="italic text-center">
              {{ optimize.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import BaseSection from "~/components/sections/BaseSection.vue";
const optimizes = ref([
  {
    value: "400%",
    desc: "Order growth rate during the first month of launch.",
  },
  {
    value: "100%",
    desc: "Successful order completion rate during the first month of Beta launch.",
  },
  {
    value: "36h",
    desc: "Average production time and provision of tracking id for orders.",
  },
  {
    value: "100%",
    desc: "Successful label creation rate for moving orders to the shipping stage.",
  },
  {
    value: "24/7",
    desc: "Our 24/7 support team ensures accuracy across all processes, production timelines, and delivery schedules.",
  },
]);
</script>

<style lang="scss">
.optimize {
  &__gradient {
    background: linear-gradient(to right, #ef811d, #ffe0e2);
    line-height: 56px;
    background-clip: text;
    color: transparent;
    font-weight: 700;
  }

  &__card-title {
    line-height: 56px;
  }
}
</style>
