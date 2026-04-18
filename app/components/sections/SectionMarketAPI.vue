<template>
  <BaseSection class="market-api">
    <div class="container mx-auto">
      <div class="grid grid-cols-12 gap-[15px]">
        <div class="col-span-12 hidden lg:flex items-center justify-center">
          <h3 class="market-api__title flex items-center gap-[5px]">
            <img class="w-[20px]" :src="'/icons/angel-right.png'" alt="icon" >
            <span class="uppercase">
              {{ $t("marketPlaces") }}
            </span>
          </h3>
          <div class="flex items-center h-full px-[15px]">
            <img :src="'/icons/dash.png'" alt="" >
          </div>

          <h3 class="market-api__title flex items-center gap-[5px]">
            <img class="w-[20px]" :src="'/icons/angel-right.png'" alt="icon" >
            <span class="uppercase"> Pressify API & CSV </span>
          </h3>
        </div>

        <div class="col-span-12 lg:col-span-6 flex justify-center">
          <div
            class="market-api__card card w-full lg:w-[220px] no-repeat bg-[#f1f1f1] bg-cover"
            :style="{
              backgroundImage: `url('/banner/card.png')`,
            }"
          >
            <div class="card__container px-[15px] lg:py-[20px] py-[50px]">
              <div class="card__header py-[15px]">
                <img class="w-[113px]" src="/partner/tiktok.png" alt="tiktok" >
              </div>

              <div class="card__body">
                <p class="my-[15px]">
                  TikTok turns product discovery and online shopping into an
                  entertaining experience
                </p>

                <nuxt-link to="#" class="card__link pb-[5px]">
                  Learn More
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>

        <div
          class="col-span-12 lg:col-span-6 flex flex-wrap lg:flex-row gap-[15px] lg:ml-[50px]"
        >
          <div
            class="market-api__card card w-full lg:w-[220px] no-repeat bg-[#f1f1f1] bg-cover"
            :style="{
              backgroundImage: `url('/banner/card.png')`,
            }"
          >
            <div class="card__container px-[15px] py-[50px] lg:py-[20px]">
              <div class="card__header py-[15px]">
                <h3 class="card__title text-[18px] mt-[15px] text-[#369636]">
                  Pressify API
                </h3>
              </div>

              <div class="card__body">
                <p class="mb-[15px]">
                  Connect to other e-commerce platforms or your own custom store
                  using the Pressify API
                </p>

                <router-link to="#" class="card__link pb-[5px]">
                  Learn More
                </router-link>
              </div>
            </div>
          </div>

          <div
            class="market-api__card card w-full lg:w-[220px] no-repeat bg-[#f1f1f1] bg-cover"
            :style="{
              backgroundImage: `url('/banner/card.png')`,
            }"
          >
            <div class="card__container px-[15px] py-[50px] lg:py-[20px]">
              <div class="card__header py-[15px]">
                <h3 class="card__title text-[18px] mt-[15px] text-[#369636]">
                  Pressify CSV
                </h3>
              </div>

              <div class="card__body">
                <p class="mb-[15px]">
                  Easily import and export product data, orders, and inventory
                  using our seamless CSV support
                </p>

                <router-link to="#" class="card__link pb-[5px]">
                  Learn More
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup>
import BaseSection from "~/components/sections/BaseSection.vue";
</script>

<style lang="scss">
.market-api {
  .card {
    &__link {
      font-size: 15px;
      transition: all 0.3s ease-in-out;
      position: relative;

      &:before,
      &:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 2px;
        left: 0;
        bottom: 0;
        background-color: #e2e2e2;
        transition: all 0.5s ease-in-out;
        z-index: 8;
      }

      &:after {
        width: 0;
        z-index: 9;
      }

      &:hover {
        &:after {
          width: 100%;
          background-color: var(--color-primary);
        }
      }
    }
  }
}
</style>
