<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  variants: {
    type: Array,
    default: () => [],
  },
  meta: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close'])

const normalize = (value) => String(value ?? '').trim()

const toRow = (variant) => {
  const id = normalize(variant?.id || variant?.variant_id || variant?.variantId || '')
  const color = normalize(variant?.color || variant?.colorName || variant?.name || '')
  const hex = normalize(variant?.hex || variant?.colorHex || '')
  const size = normalize(variant?.size || '')
  const statusRaw = normalize(variant?.stock_status || variant?.stockStatus || variant?.status || '')
  const stockNum = Number(variant?.stock ?? variant?.quantity ?? variant?.qty ?? NaN)
  const inStockBool = typeof variant?.in_stock === 'boolean' ? variant.in_stock : undefined

  const inStock =
    statusRaw
      ? /in\s*stock/i.test(statusRaw)
      : typeof inStockBool === 'boolean'
        ? inStockBool
        : Number.isFinite(stockNum)
          ? stockNum > 0
          : true

  return {
    id,
    color,
    hex,
    size,
    inStock,
    statusText: inStock ? 'In Stock' : 'Out of Stock',
  }
}

const rows = computed(() => (Array.isArray(props.variants) ? props.variants : []).map(toRow))

const technology = computed(() => normalize(props.meta?.technology || ''))
const material = computed(() => normalize(props.meta?.material || ''))
const warehouseName = computed(() => normalize(props.meta?.warehouse_name || props.meta?.warehouseName || ''))

const search = ref('')
const filterColor = ref('all')
const filterSize = ref('all')
const filterStatus = ref('all')

const colors = computed(() => {
  const seen = new Set()
  const list = []
  rows.value.forEach((r) => {
    const key = `${r.hex}__${r.color}`
    if (!r.hex && !r.color) return
    if (seen.has(key)) return
    seen.add(key)
    list.push({ hex: r.hex, color: r.color })
  })
  return list
})

const sizes = computed(() => {
  const seen = new Set()
  const list = []
  rows.value.forEach((r) => {
    if (!r.size || seen.has(r.size)) return
    seen.add(r.size)
    list.push(r.size)
  })
  return list
})

const filteredRows = computed(() => {
  const q = normalize(search.value).toLowerCase()
  return rows.value.filter((r) => {
    if (filterStatus.value === 'in' && !r.inStock) return false
    if (filterStatus.value === 'out' && r.inStock) return false
    if (filterSize.value !== 'all' && r.size !== filterSize.value) return false
    if (filterColor.value !== 'all') {
      const [hex, color] = filterColor.value.split('|')
      if (hex && r.hex !== hex) return false
      if (!hex && color && r.color !== color) return false
    }

    if (!q) return true
    return (
      r.id.toLowerCase().includes(q) ||
      r.color.toLowerCase().includes(q) ||
      r.size.toLowerCase().includes(q) ||
      r.statusText.toLowerCase().includes(q)
    )
  })
})

const pageSize = 8
const page = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))

watch([search, filterColor, filterSize, filterStatus], () => {
  page.value = 1
})

watch(totalPages, (v) => {
  if (page.value > v) page.value = v
})

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

const close = () => emit('close')

const onKeydown = (e) => {
  if (!props.open) return
  if (e.key === 'Escape') close()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="stock-modal">
      <div class="stock-modal__backdrop" @click="close" />
      <div class="stock-modal__panel" role="dialog" aria-modal="true">
        <div class="stock-modal__header">
          <div class="stock-modal__title">
            <span class="stock-modal__icon">▦</span>
            Stock details
          </div>
          <button type="button" class="stock-modal__close" aria-label="Close" @click="close">
            ✕
          </button>
        </div>

        <div class="stock-modal__body">
          <div class="stock-modal__search">
            <input v-model="search" type="text" class="stock-modal__input" placeholder="search">
          </div>

          <div class="stock-modal__filters">
            <select v-model="filterColor" class="stock-modal__select">
              <option value="all">All colors</option>
              <option
                v-for="c in colors"
                :key="`${c.hex}|${c.color}`"
                :value="`${c.hex}|${c.color}`"
              >
                {{ c.color || c.hex }}
              </option>
            </select>

            <select v-model="filterSize" class="stock-modal__select">
              <option value="all">All sizes</option>
              <option v-for="s in sizes" :key="s" :value="s">
                {{ s }}
              </option>
            </select>

            <select v-model="filterStatus" class="stock-modal__select">
              <option value="all">All stock status</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <div v-if="technology || material || warehouseName" class="stock-modal__meta">
            <div v-if="technology" class="stock-modal__meta-item">
              <span class="stock-modal__meta-label">Technology</span>
              <span class="stock-modal__meta-value">{{ technology }}</span>
            </div>
            <div v-if="material" class="stock-modal__meta-item">
              <span class="stock-modal__meta-label">Material</span>
              <span class="stock-modal__meta-value">{{ material }}</span>
            </div>
            <div v-if="warehouseName" class="stock-modal__meta-item">
              <span class="stock-modal__meta-label">Warehouse</span>
              <span class="stock-modal__meta-value">{{ warehouseName }}</span>
            </div>
          </div>

          <div class="stock-modal__table-wrap">
            <table class="stock-modal__table">
              <thead>
                <tr>
                  <th>Variant Id</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Stock status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in pagedRows" :key="`${r.id}-${r.hex}-${r.size}`">
                  <td class="stock-modal__mono">
                    {{ r.id }}
                  </td>
                  <td>
                    <div class="stock-modal__color">
                      <span v-if="r.hex" class="stock-modal__dot" :style="{ backgroundColor: r.hex }" />
                      <span>
                        {{ r.color || r.hex || '-' }}
                      </span>
                    </div>
                  </td>
                  <td>
                    {{ r.size || '-' }}
                  </td>
                  <td>
                    <span class="stock-modal__badge" :class="{ '--in': r.inStock, '--out': !r.inStock }">
                      {{ r.statusText }}
                    </span>
                  </td>
                </tr>

                <tr v-if="!pagedRows.length">
                  <td colspan="4" class="stock-modal__empty">
                    No results
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="stock-modal__pagination">
            <button
              type="button"
              class="stock-modal__page-btn"
              :disabled="page <= 1"
              @click="page = Math.max(1, page - 1)"
            >
              ‹
            </button>

            <button
              v-for="p in totalPages"
              :key="p"
              type="button"
              class="stock-modal__page"
              :class="{ '--active': p === page }"
              @click="page = p"
            >
              {{ p }}
            </button>

            <button
              type="button"
              class="stock-modal__page-btn"
              :disabled="page >= totalPages"
              @click="page = Math.min(totalPages, page + 1)"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
.stock-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgb(0 0 0 / 0.45);
  }

  &__panel {
    position: relative;
    width: min(980px, calc(100vw - 32px));
    max-height: calc(100vh - 32px);
    border-radius: 18px;
    background: #fff;
    border: 1px solid rgb(0 0 0 / 0.08);
    box-shadow: 0 24px 80px rgb(0 0 0 / 0.25);
    overflow: hidden;
  }

  &__header {
    padding: 16px 18px;
    border-bottom: 1px solid rgb(0 0 0 / 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    line-height: 24px;
    font-weight: 800;
    color: var(--color-title-section);
  }

  &__icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: rgb(0 0 0 / 0.05);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: rgb(0 0 0 / 0.65);
  }

  &__close {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgb(0 0 0 / 0.08);
    background: #fff;
    color: rgb(0 0 0 / 0.55);
    font-size: 16px;
  }

  &__close:hover {
    color: rgb(0 0 0 / 0.85);
  }

  &__body {
    padding: 16px 18px 18px;
    overflow: auto;
    max-height: calc(100vh - 120px);
  }

  &__search {
    margin-bottom: 12px;
  }

  &__input {
    width: 100%;
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgb(0 0 0 / 0.12);
    padding: 0 14px;
    font-size: 14px;
    outline: none;
  }

  &__input:focus {
    border-color: rgb(from var(--color-orange) r g b / 0.65);
    box-shadow: 0 0 0 3px rgb(from var(--color-orange) r g b / 0.18);
  }

  &__filters {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  @media (max-width: 860px) {
    &__filters {
      grid-template-columns: 1fr;
    }
  }

  &__select {
    height: 40px;
    border-radius: 12px;
    border: 1px solid rgb(0 0 0 / 0.12);
    padding: 0 12px;
    font-size: 14px;
    background: #fff;
    outline: none;
  }

  &__table-wrap {
    border-radius: 14px;
    border: 1px solid rgb(0 0 0 / 0.06);
    overflow: hidden;
  }

  &__meta {
    margin-bottom: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }

  @media (max-width: 860px) {
    &__meta {
      grid-template-columns: 1fr;
    }
  }

  &__meta-item {
    border-radius: 12px;
    border: 1px solid rgb(0 0 0 / 0.08);
    background: rgb(0 0 0 / 0.02);
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  &__meta-label {
    font-size: 12px;
    line-height: 16px;
    color: rgb(0 0 0 / 0.55);
    font-weight: 800;
  }

  &__meta-value {
    font-size: 12px;
    line-height: 16px;
    color: rgb(0 0 0 / 0.78);
    font-weight: 800;
    text-align: right;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  &__table thead th {
    text-align: left;
    font-size: 12px;
    line-height: 16px;
    color: rgb(0 0 0 / 0.55);
    font-weight: 800;
    background: rgb(0 0 0 / 0.02);
    padding: 12px 14px;
    border-bottom: 1px solid rgb(0 0 0 / 0.06);
  }

  &__table tbody td {
    padding: 12px 14px;
    border-bottom: 1px solid rgb(0 0 0 / 0.06);
    color: rgb(0 0 0 / 0.75);
  }

  &__table tbody tr:last-child td {
    border-bottom: none;
  }

  &__mono {
    font-variant-numeric: tabular-nums;
  }

  &__color {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }

  &__dot {
    width: 12px;
    height: 12px;
    border-radius: 999px;
    border: 1px solid rgb(0 0 0 / 0.2);
  }

  &__badge {
    padding: 6px 10px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__badge.--in {
    background: rgb(59 130 246 / 0.12);
    color: rgb(29 78 216);
  }

  &__badge.--out {
    background: rgb(239 68 68 / 0.12);
    color: rgb(153 27 27);
  }

  &__empty {
    text-align: center;
    padding: 22px 14px;
    color: rgb(0 0 0 / 0.55);
  }

  &__pagination {
    margin-top: 14px;
    display: flex;
    gap: 8px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  &__page,
  &__page-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgb(0 0 0 / 0.12);
    background: #fff;
    font-size: 13px;
    font-weight: 800;
    color: rgb(0 0 0 / 0.65);
  }

  &__page.--active {
    border-color: var(--color-orange);
    box-shadow: 0 0 0 2px rgb(from var(--color-orange) r g b / 0.18);
    color: rgb(0 0 0 / 0.85);
  }

  &__page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
