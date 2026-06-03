<script setup>
import ProductDetail from '~/components/catalog/ProductDetail.vue'

const route = useRoute()
const localePath = useLocalePath()
const id = computed(() => String(route.params.id || ''))

const { data: product, pending, error } = await useAsyncData(
  'catalog:product',
  async () => {
    if (!id.value) return null
    const response = await $fetch(`https://pressify.us/api/product/${id.value}`)
    return response.data
  },
  { watch: [id], server: false }
)

watch([pending, product, error, id], () => {
  if (pending.value) return
  if (!id.value || error.value || !product.value) {
    navigateTo(localePath('/catalog'), { replace: true })
  }
})

const accessories = computed(() => product.value?.accessories || [])

const tierNames = {
  11: 'Silver',
  12: 'Gold',
  13: 'Platinum',
  14: 'Diamond',
}

const dataFilter = reactive({
  color: '',
  size: '',
  tier_id: 11,
})

const prices = computed(() => {
 let variants = product.value?.variants || []

 if (dataFilter.size) {
  variants = variants.filter(variant => variant.size.toLowerCase() === dataFilter.size.toLowerCase())
 }

 if (dataFilter.color) {
  variants = variants.filter(variant => variant.hex.toLowerCase() === dataFilter.color.toLowerCase())
 }


  return variants?.reduce((acc, variant) => [...acc, ...(variant.product_prices || [])], [])
})
const minPrice = computed(() => {
  if (!prices.value.length) return 0
  return Math.min(...prices.value?.filter(price => price.tier_id === Number(dataFilter.tier_id))?.map(price => price.price) || [])
})

const medias = computed(() => product.value?.variants?.reduce((acc, variant) => {

  if (variant.package_image && variant.color) {
    if (dataFilter.color) {
      if (variant.hex.toLowerCase() === dataFilter.color.toLowerCase())
        acc.push({
          color: variant.color,
          src: variant.package_image,
        })
    }
    else {
      if (!acc.find((m) => m.color === variant.color))
        acc.push({
          color: variant.color,
          src: variant.package_image,
        })
    }
    return acc
  }
  return acc
}, []) || [])

const medias_product = computed(() => medias.value.map((m) => m.src))
useSeoMeta(() => ({
  title: product.value?.name || product.value?.title || `Product ${id.value}`,
  description: 'Product details and variants.',
  ogTitle: product.value?.name || product.value?.title || `Product ${id.value}`,
  ogDescription: 'Product details and variants.',
}))
</script>

<template>
  <div class="catalog-detail min-h-screen">
    <div class="bg-white-200">

      <div class="container mx-auto py-[15px] lg:py-[56px] px-[15px] lg:px-0">
        <div v-if="pending" class="catalog-detail__state">
          <div class="w-full h-[300px] lg:h-[400px] bg-[#F5F5F5] rounded-[8px] skeleton"/>
        </div>
        <div v-else-if="error" class="catalog-detail__state">
          {{ String(error) }}
        </div>
        <ProductDetail
          v-else-if="product"
          v-model:data-filter="dataFilter"
          :product="product"
          :min-price="minPrice"
          :medias="medias_product"
          :tier-names="tierNames"
          :accessories="accessories"
        />
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
