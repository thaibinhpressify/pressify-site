<script setup>
import CardProduct from '~/components/card/CardProduct.vue'
import HeaderSection from '~/components/sections/HeaderSection.vue'

useSeoMeta({
  title: 'Catalog',
  description: 'Browse our catalog of products and templates.',
  ogTitle: 'Catalog',
  ogDescription: 'Browse our catalog of products and templates.',
})

const localePath = useLocalePath()

const normalize = (value) => String(value ?? '').trim()
const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)))

const { data, pending, error } = await useAsyncData(
  'catalog:products',
  async () => {
    let response = await $fetch('https://pressify.us/api/all-product')
    if (typeof response === 'string') response = JSON.parse(response)
    const rawProducts = (response?.data || response?.products || response?.items || response) || []
    const list = Array.isArray(rawProducts) ? rawProducts : []
    return list.map((item) => {
      const title = normalize(item?.name || item?.title || item?.product_name || '')
      const variants = Array.isArray(item?.variants) ? item.variants : []
      const sizes = uniq(variants.map((v) => normalize(v?.size)))
      const colors = uniq(variants.map((v) => normalize(v?.hex)))
      return {
        id: item.id,
        image: normalize(item?.mockup_src || ''),
        title,
        meta: normalize(item?.brand || item?.sku || item?.model || ''),
        colors,
        sizes,
        sizeRange: sizes.join(' · '),
        style: normalize(item?.style || ''),
      }
    })
  },
  { server: false, default: () => [] }
)

const products = computed(() => data.value || [])

const filterName = ref('')
const filterSize = ref('all')
const filterColor = ref('all')
const filterStyle = ref('all')


const allStyles = computed(() => {
  const styles = products.value.flatMap((p) => p.style)
  return uniq(styles).sort((a, b) => a.localeCompare(b))
})

const allSizes = computed(() => {
  let sizes = []
  if (filterStyle.value === 'all') {
    sizes = products.value.flatMap((p) => (Array.isArray(p?.sizes) ? p.sizes : []))
  } else {
    sizes = products.value.filter((p) => normalize(p.style) === normalize(filterStyle.value)).flatMap((p) => (Array.isArray(p?.sizes) ? p.sizes : []))
  }
  return uniq(sizes).sort((a, b) => a.localeCompare(b))
})

const allColors = computed(() => {
  let colors = []
  if (filterStyle.value === 'all') {
    colors = products.value.flatMap((p) => (Array.isArray(p?.colors) ? p.colors : []))
  } else {
    colors = products.value.filter((p) => normalize(p.style) === normalize(filterStyle.value)).flatMap((p) => (Array.isArray(p?.colors) ? p.colors : []))
  }
  return uniq(colors).sort((a, b) => a.localeCompare(b))
})

const filteredProducts = computed(() => {
  const q = normalize(filterName.value).toLowerCase()
  return products.value.filter((p) => {
    if (q) {
      const title = normalize(p?.title).toLowerCase()
      if (!title.includes(q)) return false
    }

    if (filterStyle.value !== 'all') {
      const style = p.style
      if (normalize(style) === normalize(filterStyle.value)) return true
      else return false
    }

    if (filterSize.value !== 'all') {
      const sizes = Array.isArray(p?.sizes) ? p.sizes : []
      if (!sizes.includes(filterSize.value)) return false
    }

    if (filterColor.value !== 'all') {
      const colors = Array.isArray(p?.colors) ? p.colors : []
      if (!colors.includes(filterColor.value)) return false
    }

    return true
  })
})

const clearFilters = () => {
  filterName.value = ''
  filterSize.value = 'all'
  filterColor.value = 'all'
  filterStyle.value = 'all'
}
</script>

<template>
  <div class="catalog min-h-screen">
    <HeaderSection
      status="Pressify"
      :title="$t('catalogPage.title')"
      desc=""
    />

    <div class="catalog__main bg-white-200">
      <div class="container mx-auto lg:py-[56px] p-[15px] lg:px-0">
        <div class="grid grid-cols-12 gap-[24px]">
          <div class="col-span-12 text-right">
            <div v-if="pending" class="catalog__state">
              <div class="grid grid-cols-12 gap-[24px]">
                <div class="col-span-3">
                  <div class="w-full h-[500px] bg-[#F5F5F5] rounded-[8px] skeleton"/>
                </div>
                <div class="col-span-9">
                  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[18px]">
                    <div v-for="(_, index) in 12" :key="index" class="w-full h-[300px] lg:h-[400px] bg-[#F5F5F5] rounded-[8px] skeleton"/>
                  </div>
                </div>
              </div>
              
            </div>
            <div v-else-if="error" class="catalog__state">
              {{ String(error) }}
            </div>
            <div v-else class="catalog__count w-full text-right">
              {{ $t('catalogPage.showing', { count: filteredProducts.length }) }}
            </div>
          </div>
          <div class="col-span-12 lg:col-span-3">
            <div class="catalog__sidebar bg-white">
              <div class="catalog__sidebar-title">
                {{ $t('catalogPage.filters.title') }}
              </div>
              <div class="catalog__filters">
                <div class="catalog__field">
                  <div class="catalog__label">
                    {{ $t('catalogPage.filters.name') }}
                  </div>
                  <input
                    v-model="filterName"
                    class="catalog__input"
                    type="text"
                    :placeholder="$t('catalogPage.filters.namePlaceholder')"
                  >
                </div>

                <div class="catalog__field">
                  <div class="catalog__label">
                    {{ $t('catalogPage.filters.style') }}
                  </div>
                  <select v-model="filterStyle" class="catalog__select">
                    <option value="all">{{ $t('catalogPage.filters.allStyles') }}</option>
                    <option v-for="s in allStyles" :key="s" :value="s">
                      {{ s }}
                    </option>
                  </select>
                </div>

                <div class="catalog__field">
                  <div class="catalog__label">
                    {{ $t('catalogPage.filters.size') }}
                  </div>
                  <select v-model="filterSize" class="catalog__select">
                    <option value="all">{{ $t('catalogPage.filters.allSizes') }}</option>
                    <option v-for="s in allSizes" :key="s" :value="s">
                      {{ s }}
                    </option>
                  </select>
                </div>

                <div class="catalog__field">
                  <div class="catalog__label">
                    {{ $t('catalogPage.filters.color') }}
                  </div>
                  <div class="catalog__colors">
                    <button
                      type="button"
                      class="catalog__color --all"
                      :class="{ '--active': filterColor === 'all' }"
                      @click="filterColor = 'all'"
                    >
                      {{ $t('catalogPage.filters.allColors') }}
                    </button>
                    <button
                      v-for="c in allColors"
                      :key="c"
                      type="button"
                      class="catalog__color"
                      :class="{ '--active': filterColor === c }"
                      :style="{ backgroundColor: c }"
                      :aria-label="c"
                      :title="c"
                      @click="filterColor = c"
                    />
                  </div>
                </div>

                <button type="button" class="btn --outline-primary w-full" @click="clearFilters">
                  {{ $t('catalogPage.filters.clear') }}
                </button>
              </div>
            </div>
          </div>

          <div class="col-span-12 lg:col-span-9">
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[18px]">
              <NuxtLink
                v-for="p in filteredProducts"
                :key="p.id"
                :to="localePath(`/catalog/${p.id}`)"
                class="catalog__product"
              >
                <CardProduct
                  :key="p.meta"
                  :image="p.image"
                  :meta="p.meta"
                  :colors="p.colors"
                  :size-range="p.sizeRange"
                >
                  <template #title>
                    <span class="text-black-200">
                      {{ p.title }}
                    </span>
                  </template>
                </CardProduct>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.catalog {
  &__main {
    min-height: calc(100vh - 260px);
  }

  &__sidebar {
    border-radius: 16px;
    padding: 18px 18px 20px;
    border: 1px solid rgb(0 0 0 / 0.06);

    @media (min-width: 1024px) {
      position: sticky;
      top: 92px;
    }
  }

  &__sidebar-title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 800;
    color: var(--color-title-section);
    padding-bottom: 12px;
    border-bottom: 1px solid rgb(0 0 0 / 0.06);
  }

  &__filters {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-size: 12px;
    line-height: 16px;
    color: rgb(0 0 0 / 0.55);
    font-weight: 800;
  }

  &__input,
  &__select {
    width: 100%;
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgb(0 0 0 / 0.12);
    padding: 0 12px;
    font-size: 14px;
    outline: none;
    background: #fff;
  }

  &__input:focus,
  &__select:focus {
    border-color: rgb(from var(--color-orange) r g b / 0.65);
    box-shadow: 0 0 0 3px rgb(from var(--color-orange) r g b / 0.18);
  }

  &__colors {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    max-height: 160px;
    overflow: auto;
    padding-right: 4px;
  }

  &__color {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid rgb(0 0 0 / 0.18);
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    color: rgb(0 0 0 / 0.55);
    transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  }

  &__color:hover {
    transform: translateY(-1px);
  }

  &__color:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgb(from var(--color-orange) r g b / 0.18);
    border-color: rgb(from var(--color-orange) r g b / 0.65);
  }

  &__color.--all {
    width: auto;
    padding: 0 10px;
    min-width: 48px;
    background: rgb(0 0 0 / 0.02);
  }

  &__color.--active {
    border-color: var(--color-orange);
    box-shadow: 0 0 0 2px rgb(from var(--color-orange) r g b / 0.18);
  }

  &__state {
    margin-bottom: 14px;
    font-size: 14px;
    line-height: 20px;
    color: rgb(0 0 0 / 0.55);
  }

  &__count {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 18px;
    color: rgb(0 0 0 / 0.55);
    font-weight: 700;
  }
}
</style>
