<script setup>
import { useMenu } from '~/composables/menu/home';
import MenuFooter from '~/components/footer/MenuFooter.vue';
const { menuPage, menuIntegrations, menuShipping } = useMenu();
const localePath = useLocalePath();
</script>
<template>
<footer class="footer bg-black-300">
  <div class="container mx-auto px-[15px] lg:px-0">
    <div class="footer__header w-full">
      <h4 class="footer__title w-full text-white text-center">
        {{ $t('footer.title') }}
      </h4>
      <p class="text-center footer__desc">
        {{ $t('footer.desc') }}
      </p>
    </div>

    <div class="footer__bottom w-full">
      <div class="grid grid-cols-12">
        <div class="col-span-12 lg:col-span-4">
          <NuxtLink :to="localePath('/')">
            <img class="h-[80px] py-[10px]" src="/logo.png" alt="Pressify" >
          </NuxtLink>

          <div class="footer__address text-white mb-[55px]">
            <strong>
              9960 W Sam Houston Parkway South
            </strong>
            <span class="block w-full">Houston, Texas 77099</span>
            <span class="block w-full">United States (US)</span>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-8">
          <div class="grid lg:grid-cols-3 grid-cols-2 gap-[24px] ">
            <div class="footer__widget">
              <h4 class="footer__widget-title text-white text-[20px] font-bold py-[10px]">
               Page
              </h4>

              <MenuFooter class="text-white" :menu="menuPage" />
            </div>

             <div class="footer__widget">
              <h4 class="footer__widget-title text-white text-[20px] font-bold py-[10px]">
               {{ $t('footer.integrations') }}
              </h4>

              <MenuFooter class="text-white" :menu="menuIntegrations" />
            </div>

             <div class="footer__widget">
              <h4 class="footer__widget-title text-white text-[20px] font-bold py-[10px]">
               {{ $t('footer.shipping') }}
              </h4>

              <MenuFooter class="text-white" :menu="menuShipping" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer__copyright py-[30px] w-full">
      <div class="grid grid-cols-12">
        <div class="col-span-12 lg:col-span-6 text-white">
          © 2024 Pressify. All Rights Reserved.
        </div>
        <div class="col-span-12 lg:col-span-6">
          <ul class="flex items-center text-white justify-end gap-[80px]">
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">YouTube</a>
            </li>
            <li>
              <a href="#">Twitter(X)</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</footer>
</template>

<style lang="scss">
  .footer {
    padding: 36px 0 30px;
    &__title {
      font-size: 38px;
      line-height: 40px;
      font-weight: 500;
    }

    &__desc {
      padding: 10px 0;
      color: rgba(255, 255, 255, 0.6);
    }

    &__address {
      &, & * {
        color: #fff;
      }
    }
  }
</style>
