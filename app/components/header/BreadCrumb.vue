<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const localePath = useLocalePath();
</script>

<template>
  <div class="breadcrumb">
    <div class="breadcrumb__item">
      <NuxtLink :to="localePath('/')">Home</NuxtLink>
    </div>

    <div v-for="(item, index) in items" :key="`${index}-${item.label}`" class="breadcrumb__item">
      <span class="breadcrumb__sep">/</span>
      <NuxtLink v-if="item.to" :to="localePath(item.to)">
        {{ item.label }}
      </NuxtLink>
      <span v-else class="breadcrumb__current">
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;

  &__item {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    line-height: 16px;
    color: rgb(0 0 0 / 0.55);
  }

  a {
    color: rgb(0 0 0 / 0.55);
  }

  a:hover {
    color: var(--color-orange);
  }

  &__sep {
    color: rgb(0 0 0 / 0.25);
  }

  &__current {
    color: rgb(0 0 0 / 0.75);
    font-weight: 600;
  }
}
</style>
