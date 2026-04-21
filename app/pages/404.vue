<script setup>
const localePath = useLocalePath()

useSeoMeta({
  title: '404',
  description: 'Page not found.',
})
</script>

<template>
  <div class="page error-404 bg-white-200">
    <div class="container mx-auto py-[64px] px-[15px] lg:px-0">
      <div class="error-404__card bg-white">
        <div class="error-404__code">
          404
        </div>
        <h1 class="error-404__title">
          Page not found
        </h1>
        <p class="error-404__desc">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <div class="error-404__actions">
          <NuxtLink class="btn --primary error-404__btn" :to="localePath('/')">
            Back to Home
          </NuxtLink>
          <NuxtLink class="btn --outline-primary error-404__btn" :to="localePath('/contact')">
            Contact Support
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.error-404 {
  min-height: calc(100vh - 260px);

  &__card {
    border-radius: 18px;
    border: 1px solid rgb(0 0 0 / 0.06);
    padding: 36px 18px;
    text-align: center;
    max-width: 720px;
    margin: 0 auto;
  }

  &__code {
    width: 84px;
    height: 84px;
    border-radius: 20px;
    margin: 0 auto 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 900;
    color: var(--color-orange);
    background: rgb(from var(--color-orange) r g b / 0.12);
  }

  &__title {
    font-size: 34px;
    line-height: 40px;
    font-weight: 900;
    color: var(--color-title-section);
  }

  &__desc {
    margin-top: 10px;
    font-size: 14px;
    line-height: 20px;
    color: rgb(0 0 0 / 0.55);
  }

  &__actions {
    margin-top: 22px;
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__btn {
    min-width: 170px;
    justify-content: center;
  }
}
</style>
