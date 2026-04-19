<script setup>
const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  meta: {
    type: String,
    default: '',
  },
  colors: {
    type: Array,
    default: () => [],
  },
  maxSwatches: {
    type: Number,
    default: 6,
  },
  sizes: {
    type: Array,
    default: () => [],
  },
})

const swatches = computed(() => props.colors.slice(0, props.maxSwatches))
const extraCount = computed(() => Math.max(0, props.colors.length - props.maxSwatches))
const sizes = computed(() => props.sizes.slice(0, 5))
const extraSize = computed(() => Math.max(0, props.sizes.length - props.maxSwatches))
</script>

<template>
  <div class="card-product bg-white h-full">
    <div class="card-product__media">
      <img v-if="image" class="card-product__img" :src="image" :alt="title || 'Product'" >
    </div>
    <div class="card-product__content">
      <h3 class="card-product__title">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
      <div v-if="meta" class="card-product__meta">
        {{ meta }}
      </div>

      <div v-if="swatches.length" class="card-product__swatches">
        <span
          v-for="(c, i) in swatches"
          :key="`${c}-${i}`"
          class="card-product__swatch"
          :style="{ backgroundColor: c }"
        />
        <span v-if="extraCount" class="card-product__more">
          +{{ extraCount }}
        </span>
      </div>

      <div v-if="sizes.length" class="card-product__sizes">
        {{ sizes.join(', ') }}
        <span v-if="extraSize" class="card-product__more">
          +{{ extraSize }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.card-product {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgb(0 0 0 / 0.06);

  &__link {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__media {
    background-color: var(--color-white);
    border-bottom: 1px solid rgb(0 0 0 / 0.06);
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__content {
    padding: 18px 18px 20px;
  }

  &__title {
    font-size: 28px;
    line-height: 34px;
    font-weight: 800;
    color: var(--color-title-section);
  }

  &__meta {
    margin-top: 10px;
    font-size: 14px;
    line-height: 18px;
    color: rgb(0 0 0 / 0.45);
    font-weight: 600;
  }

  &__swatches {
    margin-top: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__swatch {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 2px solid rgb(0 0 0 / 0.08);
  }

  &__more {
    font-size: 18px;
    line-height: 18px;
    font-weight: 700;
    color: rgb(0 0 0 / 0.45);
  }

  &__sizes {
    margin-top: 10px;
    line-height: 18px;
    font-weight: 700;
    color: rgb(0 0 0 / 0.45);
  }
}
</style>
