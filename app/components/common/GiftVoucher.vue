<script setup>
const localePath = useLocalePath()
</script>

<template>
  <div class="gift-voucher-container rounded-[15px] overflow-hidden">
    <NuxtLink
    :to="localePath('/signup?vouncher=30')"
    class="gift-voucher"
    aria-label="$30 off your first fulfillment"
  >
    <img
      src="/vouncher-30.png"
      alt="$30 voucher — first fulfillment free"
      width="100"
      height="auto"
      loading="lazy"
      decoding="async"
    >
  </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.gift-voucher {
  position: fixed;
  right: 10px;
  bottom: 20px;
  z-index: 999;
  display: block;
  line-height: 0;
  transition:
    transform 0.22s ease,
    filter 0.22s ease;
  filter: drop-shadow(0 6px 20px rgb(0 0 0 / 0.22));
  animation: gift-voucher-float 4s ease-in-out infinite;

  img {
    display: block;
    width: auto;
    height: 96px;
    max-width: min(130px, 34vw);
    object-fit: contain;
  }

  // @media (min-width: 640px) {
  //   left: 16px;
  //   bottom: 180px;

  //   img {
  //     height: 80px;
  //     max-width: 100px;
  //   }
  // }

  @media (min-width: 1024px) {
    left: 70px;
    bottom: 40px;

    img {
      height: 100px;
      max-width: 130px;
    }
  }

  &:hover {
    transform: translateY(-5px) scale(1.03);
    filter: drop-shadow(0 10px 28px rgb(0 0 0 / 0.28));
    animation-play-state: paused;
  }

  &:focus-visible {
    outline: 2px solid var(--color-orange, #ff7900);
    outline-offset: 4px;
    border-radius: 8px;
  }
}

@keyframes gift-voucher-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>
