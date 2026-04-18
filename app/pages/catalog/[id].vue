<script setup>
import ProductDetail from '~/components/catalog/ProductDetail.vue'

const route = useRoute()
const id = computed(() => String(route.params.id || ''))

const { data, pending, error } = await useAsyncData(
  'catalog:product',
  async () => {
    if (!id.value) return null
    const response = await $fetch(`https://pressify.us/api/product/${id.value}`)

    console.log('===> response', response)
    return response.data
  },
  { watch: [id], server: false }
)

const product = computed(() => data.value || null)

useSeoMeta(() => ({
  title: product.value?.name || product.value?.title || `Product ${id.value}`,
  description: 'Product details and variants.',
  ogTitle: product.value?.name || product.value?.title || `Product ${id.value}`,
  ogDescription: 'Product details and variants.',
}))
</script>

<template>
  <div class="catalog-detail">
    <div class="bg-white-200">
      <div class="container mx-auto py-[56px] px-[15px] lg:px-0">
        <div v-if="pending" class="catalog-detail__state">
          <div class="w-full h-[300px] lg:h-[400px] bg-[#F5F5F5] rounded-[8px] skeleton"/>
        </div>
        <div v-else-if="error" class="catalog-detail__state">
          {{ String(error) }}
        </div>
        <ProductDetail v-else-if="product" :product="product" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.catalog-detail {
  &__state {
    font-size: 14px;
    line-height: 20px;
    color: rgb(0 0 0 / 0.55);
  }
}
</style>
