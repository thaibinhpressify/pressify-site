<template>
  <BaseSection
    class="bg-[#ebf1eb]"
    title="A technology solution that helps sellers scale production and increase success rates when selling on every platform.
"
  >
    <div class="container mx-aut">
      <div class="grid grid-cols-12 gap-[15px]">
        <div class="col-span-12">
          <p class="text-center text-[15px] w-full lg:w-[700px] m-auto">
            Using Pressify backs your print-on-demand store with a solid
            infrastructure that’s constantly being upgraded. That means higher
            dependability and smooth operation around the clock.
          </p>
        </div>

        <div
          v-for="(tech, i) in technologies"
          :key="i"
          class="col-span-12 lg:col-span-6"
        >
          <div class="card p-[15px]">
            <div class="card__icon">
              <img class="w-[60px]" :src="tech.icon" alt="" >
            </div>
            <h3 class="card__title technology__item-title my-[10px]">
              {{ tech.title }}
            </h3>
            <p>
              {{ tech.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import BaseSection from "~/components/sections/BaseSection.vue";
import { ref } from "vue";

const technologies = ref([
  {
    icon: "/card/coin.png",
    title: "Count on us",
    desc: "We’re fully prepared to handle anything that comes our way. Our top-performing Print Providers work around the clock to provide dependable order fulfillment even during peak sales seasons.",
  },
  {
    icon: "/card/time.png",
    title: "Guaranteed production time",
    desc: "Get accurate production time estimates from our Partners to set realistic expectations for your customers.",
  },
  {
    icon: "/card/global.png",
    title: "Global Print Provider network",
    desc: "Printify has partnered with the world’s best Print Providers so you can enjoy quality products, low shipping costs, and speedy delivery worldwide.",
  },
  {
    icon: "/card/stock.png",
    title: "Shutterstock integration",
    desc: "Not feeling very artsy? No worries! Printify’s Shutterstock integration gives you access to one of the largest stock photo libraries in the world with millions of pre-made designs.",
  },
]);
</script>

<style lang="scss">
.technology {
  &__item-title {
    font-size: 20px;
    font-weight: 900;
  }
}
</style>
