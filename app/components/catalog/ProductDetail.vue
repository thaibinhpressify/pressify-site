<script setup>
import BreadCrumb from '~/components/header/BreadCrumb.vue'
import StockDetailsModal from '~/components/catalog/StockDetailsModal.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:color', 'update:size', 'update:image'])

const variants = computed(() => Array.isArray(props.product?.variants) ? props.product.variants : [])

const title = computed(() => String(props.product?.name || props.product?.title || props.product?.product_name || ''))
const category = computed(() => String(props.product?.category || props.product?.type || props.product?.group || ''))
const brand = computed(() => String(props.product?.brand || ''))
const model = computed(() => String(props.product?.model || props.product?.gildan || ''))
const sku = computed(() => String(props.product?.sku || props.product?.product_sku || props.product?.id || ''))

const galleryImages = computed(() => {
  const images = []
  const push = (src) => {
    const s = String(src || '').trim()
    if (s && !images.includes(s)) images.push(s)
  }
  push(props.product?.mockup_src)
  push(props.product?.image)
  push(props.product?.thumbnail)
  push(props.product?.photo)
  variants.value.forEach((v) => {
    push(v?.mockup_src)
    push(v?.image)
  })
  return images
})

const colors = computed(() => {
  const seen = new Set()
  const list = []
  variants.value.forEach((v) => {
    const hex = String(v?.hex || v?.colorHex || '').trim()
    if (!hex || seen.has(hex)) return
    seen.add(hex)
    list.push({
      hex,
      name: String(v?.color || v?.colorName || '').trim(),
    })
  })
  return list
})

const sizes = computed(() => {
  const seen = new Set()
  const list = []
  variants.value.forEach((v) => {
    const size = String(v?.size || '').trim()
    if (!size || seen.has(size)) return
    seen.add(size)
    list.push(size)
  })
  return list
})

const selectedColor = ref(colors.value[0]?.hex || '')
const selectedSize = ref(sizes.value[0] || '')
const selectedImage = ref(galleryImages.value[0] || props.product?.mockup_src || '')

watch(colors, (v) => {
  if (!selectedColor.value && v?.[0]?.hex) selectedColor.value = v[0].hex
})
watch(sizes, (v) => {
  if (!selectedSize.value && v?.[0]) selectedSize.value = v[0]
})
watch(galleryImages, (v) => {
  if (!selectedImage.value && v?.[0]) selectedImage.value = v[0]
})

const activeVariant = computed(() => {
  const byColorAndSize = variants.value.find(
    (v) => String(v?.hex || '').trim() === selectedColor.value && String(v?.size || '').trim() === selectedSize.value
  )
  if (byColorAndSize) return byColorAndSize
  const byColor = variants.value.find((v) => String(v?.hex || '').trim() === selectedColor.value)
  return byColor || null
})

watch(activeVariant, (v) => {
  const nextImage = String(v?.mockup_src || v?.image || '').trim()
  if (nextImage) selectedImage.value = nextImage
})

const activeColorName = computed(() => {
  const c = colors.value.find((x) => x.hex === selectedColor.value)
  return c?.name || ''
})

const availabilityText = computed(() => {
  const total = variants.value.length
  if (!total) return ''
  return `${total} SKUs in-stock`
})

const isStockModalOpen = ref(false)
const openStockModal = () => {
  if (!variants.value.length) return
  isStockModalOpen.value = true
}
const closeStockModal = () => {
  isStockModalOpen.value = false
}

const breadcrumbItems = computed(() => [
  { label: 'Catalog', to: '/catalog' },
  { label: title.value || 'Product' },
])

const contentHtml = computed(() => String(props.product?.content || '').trim())

const productMeta = computed(() => ({
  technology: props.product?.technology,
  material: props.product?.material,
  warehouse_name: props.product?.warehouse_name,
}))

const technologyValue = computed(() => String(productMeta.value?.technology || '').trim())
const materialValue = computed(() => String(productMeta.value?.material || '').trim())
const warehouseNameValue = computed(() => String(productMeta.value?.warehouse_name || '').trim())

const tierNames = {
  11: 'Silver',
  12: 'Gold',
  13: 'Platinum',
  14: 'Diamond',
}

const toNumber = (value) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

const collectTierPrices = (variant) => {
  const prices = Array.isArray(variant?.prices) ? variant.prices : []
  const map = new Map()
  prices.forEach((p) => {
    const tierId = toNumber(p?.tier_id)
    const price = toNumber(p?.price)
    if (tierId === null || price === null) return
    const prev = map.get(tierId)
    if (prev === undefined || price < prev) map.set(tierId, price)
  })

  return Array.from(map.entries())
    .map(([tierId, price]) => ({
      tierId,
      tierName: tierNames[tierId] || `Tier ${tierId}`,
      price,
    }))
    .sort((a, b) => a.tierId - b.tierId)
}

const formatPrice = (value) => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  } catch {
    return `$${value.toFixed(2)}`
  }
}

const activeTierPrices = computed(() => collectTierPrices(activeVariant.value))
const priceRangeText = computed(() => {
  const list = activeTierPrices.value
  if (!list.length) return ''
  const values = list.map((x) => x.price)
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return formatPrice(min)
  return `${formatPrice(min)} - ${formatPrice(max)}`
})
</script>

<template>
  <div class="product-detail">
    <BreadCrumb :items="breadcrumbItems" class="mb-[18px]" />

    <div class="grid grid-cols-12 gap-[24px]">
      <div class="col-span-12 lg:col-span-6">
        <div class="product-detail__gallery bg-white">
          <div class="product-detail__image">
            <img :src="selectedImage" :alt="title" class="product-detail__image-img">
          </div>

          <div v-if="galleryImages.length" class="product-detail__thumbs">
            <button
              v-for="img in galleryImages"
              :key="img"
              type="button"
              class="product-detail__thumb"
              :class="{ '--active': img === selectedImage }"
              @click="
                selectedImage = img;
                emit('update:image', img);
              "
            >
              <img :src="img" :alt="title" class="product-detail__thumb-img">
            </button>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-6">
        <div class="product-detail__panel bg-white">
          <div v-if="category" class="product-detail__category">
            {{ category }}
          </div>

          <h1 class="product-detail__title">
            {{ title }}
          </h1>

          <div v-if="priceRangeText" class="product-detail__price">
            {{ priceRangeText }}
          </div>

          <div class="product-detail__meta">
            <span v-if="brand" class="product-detail__badge">
              By {{ brand }}
            </span>
            <span v-if="model" class="product-detail__badge">
              {{ model }}
            </span>
            <span v-if="sku" class="product-detail__badge">
              Style: {{ product.style }}
            </span>
          </div>

          <div v-if="activeTierPrices.length" class="product-detail__tiers">
            <div v-for="t in activeTierPrices" :key="t.tierId" class="product-detail__tier">
              <span class="product-detail__tier-name">{{ t.tierName }}</span>
              <span class="product-detail__tier-price">{{ formatPrice(t.price) }}</span>
            </div>
          </div>

          <div v-if="technologyValue || materialValue || warehouseNameValue" class="product-detail__kv">
            <div v-if="technologyValue" class="product-detail__kv-item">
              <span class="product-detail__kv-label">Technology</span>
              <span class="product-detail__kv-value">{{ technologyValue }}</span>
            </div>
            <div v-if="materialValue" class="product-detail__kv-item">
              <span class="product-detail__kv-label">Material</span>
              <span class="product-detail__kv-value">{{ materialValue }}</span>
            </div>
            <div v-if="warehouseNameValue" class="product-detail__kv-item">
              <span class="product-detail__kv-label">Warehouse</span>
              <span class="product-detail__kv-value">{{ warehouseNameValue }}</span>
            </div>
          </div>

          <div class="product-detail__option">
            <div class="product-detail__label">
              Color:
              <span class="product-detail__value">
                {{ activeColorName }}
              </span>
            </div>
            <div class="product-detail__swatches">
              <button
                v-for="c in colors"
                :key="c.hex"
                type="button"
                class="product-detail__swatch"
                :class="{ '--active': c.hex === selectedColor }"
                :style="{ backgroundColor: c.hex }"
                @click="
                  selectedColor = c.hex;
                  emit('update:color', c.hex);
                "
              >
                <span v-if="c.hex === selectedColor" class="product-detail__swatch-check">✓</span>
              </button>
            </div>
          </div>

          <div class="product-detail__option">
            <div class="product-detail__label">
              Size
            </div>
            <div class="product-detail__sizes">
              <button
                v-for="s in sizes"
                :key="s"
                type="button"
                class="product-detail__size"
                :class="{ '--active': s === selectedSize }"
                @click="
                  selectedSize = s;
                  emit('update:size', s);
                "
              >
                {{ s }}
              </button>
            </div>
          </div>

          <div class="product-detail__option">
            <div class="product-detail__label">
              Availability
            </div>
            <button
              v-if="availabilityText"
              type="button"
              class="product-detail__availability"
              @click="openStockModal"
            >
              {{ availabilityText }}
            </button>
          </div>

          <div class="product-detail__cta">
            <button type="button" class="btn --outline-primary product-detail__cta-btn">
              Contact Support
            </button>
            <button type="button" class="btn --primary product-detail__cta-btn">
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div class="col-span-12">
        <div v-if="contentHtml" class="product-detail__content bg-white">
          <div class="product-detail__content-title">
            Description
          </div>
          <div class="wp-content" v-html="contentHtml" />
        </div>
      </div>
    </div>

    <StockDetailsModal
      :open="isStockModalOpen"
      :variants="variants"
      :meta="productMeta"
      @close="closeStockModal"
    />
  </div>
</template>

<style lang="scss">
.product-detail {
  &__gallery,
  &__panel {
    border-radius: 16px;
    border: 1px solid rgb(0 0 0 / 0.06);
  }

  &__gallery {
    padding: 16px;
  }

  &__image {
    border-radius: 14px;
    background: rgb(0 0 0 / 0.02);
    overflow: hidden;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__image-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__thumbs {
    margin-top: 12px;
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  &__thumb {
    width: 66px;
    height: 66px;
    border-radius: 12px;
    border: 1.5px solid rgb(0 0 0 / 0.08);
    background: rgb(0 0 0 / 0.02);
    flex: 0 0 auto;
    overflow: hidden;
  }

  &__thumb.--active {
    border-color: var(--color-orange);
    box-shadow: 0 0 0 2px rgb(from var(--color-orange) r g b / 0.2);
  }

  &__thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__panel {
    padding: 18px 18px 20px;
  }

  &__category {
    color: rgb(0 0 0 / 0.55);
    font-size: 14px;
    line-height: 18px;
    font-weight: 600;
  }

  &__title {
    margin-top: 6px;
    font-size: 34px;
    line-height: 40px;
    font-weight: 800;
    color: var(--color-title-section);
  }

  &__price {
    margin-top: 10px;
    font-size: 18px;
    line-height: 22px;
    font-weight: 900;
    color: rgb(0 0 0 / 0.85);
  }

  &__meta {
    margin-top: 12px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__tiers {
    margin-top: 12px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__tier {
    padding: 8px 10px;
    border-radius: 12px;
    border: 1px solid rgb(0 0 0 / 0.08);
    background: rgb(0 0 0 / 0.02);
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  &__tier-name {
    font-size: 12px;
    line-height: 16px;
    font-weight: 800;
    color: rgb(0 0 0 / 0.6);
  }

  &__tier-price {
    font-size: 12px;
    line-height: 16px;
    font-weight: 900;
    color: rgb(0 0 0 / 0.82);
  }

  &__badge {
    padding: 6px 10px;
    border-radius: 8px;
    background: rgb(0 0 0 / 0.04);
    font-size: 12px;
    line-height: 14px;
    font-weight: 700;
    color: rgb(0 0 0 / 0.75);
  }

  &__kv {
    margin-top: 12px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  &__kv-item {
    border-radius: 12px;
    border: 1px solid rgb(0 0 0 / 0.08);
    background: rgb(0 0 0 / 0.02);
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__kv-label {
    font-size: 12px;
    line-height: 16px;
    color: rgb(0 0 0 / 0.55);
    font-weight: 800;
  }

  &__kv-value {
    font-size: 12px;
    line-height: 16px;
    color: rgb(0 0 0 / 0.78);
    font-weight: 800;
    text-align: right;
  }

  &__actions {
    margin-top: 16px;
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    padding-top: 14px;
    border-top: 1px solid rgb(0 0 0 / 0.06);
    color: rgb(0 0 0 / 0.6);
    font-size: 13px;
    line-height: 18px;
  }

  &__link {
    color: rgb(0 0 0 / 0.65);
    font-weight: 600;
  }

  &__link:hover {
    color: var(--color-orange);
  }

  &__sep {
    color: rgb(0 0 0 / 0.25);
  }

  &__option {
    margin-top: 16px;
  }

  &__label {
    font-size: 13px;
    line-height: 16px;
    font-weight: 700;
    color: rgb(0 0 0 / 0.65);
  }

  &__value {
    font-weight: 800;
    color: rgb(0 0 0 / 0.85);
  }

  &__swatches {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__swatch {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid rgb(0 0 0 / 0.18);
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__swatch.--active {
    box-shadow: 0 0 0 2px rgb(from var(--color-orange) r g b / 0.35);
    border-color: var(--color-orange);
  }

  &__swatch-check {
    width: 16px;
    height: 16px;
    border-radius: 6px;
    background: rgb(0 0 0 / 0.6);
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
  }

  &__sizes {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__size {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgb(0 0 0 / 0.14);
    background: #fff;
    font-size: 12px;
    font-weight: 700;
    color: rgb(0 0 0 / 0.75);
    min-width: 38px;
  }

  &__size.--active {
    border-color: var(--color-orange);
    box-shadow: 0 0 0 2px rgb(from var(--color-orange) r g b / 0.2);
  }

  &__availability {
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid rgb(0 0 0 / 0.12);
    display: inline-flex;
    font-size: 13px;
    font-weight: 700;
    color: rgb(0 0 0 / 0.7);
    background: rgb(0 0 0 / 0.02);
    cursor: pointer;
  }

  &__cta {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  &__cta-btn {
    width: 100%;
    justify-content: center;
  }

  &__content {
    margin-top: 24px;
    border-radius: 16px;
    border: 1px solid rgb(0 0 0 / 0.06);
    padding: 18px;
  }

  &__content-title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 800;
    color: var(--color-title-section);
    margin-bottom: 10px;
  }
}
</style>
