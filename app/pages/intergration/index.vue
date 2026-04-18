<template>
  <div class="page">
    <BannerVideo class="page__banner">
      <div
        class="page__banner-intro w-full h-full flex items-center lg:flex-row"
      >
        <div class="container mx-auto">
          <div class="grid grid-cols-12 items-center justify-center">
            <div
              class="col-span-12 lg:col-span-6 h-full flex flex-wrap items-center text-left"
            >
              <div class="intro">
                <h2
                  class="title text-left uppercase text-white text-[24px] lg:text-[46px] w-full lg:w-[500px]"
                >
                  Connect to sell everywhere with
                  <span class="text-orange"> Pressify </span>
                </h2>
                <span class="text-white block w-full py-[10px]">
                  Integrate <span class="text-orange"> Pressify </span> with
                  your store
                </span>

                <button class="btn --primary my-[15px] uppercase">
                  {{ $t("banner.connectStore") }}
                </button>

                <span class="text-white block w-full">
                  100% Free and beginner-friendly
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BannerVideo>
    <SectionOptmize />
    <SectionMarketAPI />
    <SectionConnectStore />
    <SectionTechnology />
    <SectionProtection />
    <SectionAnswer />
  </div>
</template>

<script setup>
import BannerVideo from "~/components/banner/BannerVideo.vue";
import SectionOptmize from "~/components/sections/SectionOptmize.vue";
import SectionMarketAPI from "~/components/sections/SectionMarketAPI.vue";
import SectionConnectStore from "~/components/sections/SectionConnectStore.vue";
import SectionTechnology from "~/components/sections/SectionTechnology.vue";
import SectionProtection from "~/components/sections/SectionProtection.vue";
import SectionAnswer from "~/components/sections/SectionAnswer.vue";
</script>

<style lang="scss">
.page {
  .title {
    & *, & {
      font-size: 48px;
      line-height: 56px;
    }
  }

  &__banner {
    height: calc(100vh - 77px);
    height: calc(100dvh - 77px);

    .banner-video-intro__content {
      padding: 50px 15px 60px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      @media screen and (min-width: 768px) {
        padding: 90px 15px 60px;
      }
    }

    .page__banner-intro img {
      object-position: 50% 50%;
      width: 100%;
      height: auto;
    }
  }
}
</style>
