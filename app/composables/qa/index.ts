import { useWpStore } from "~~/stores/wp";

export const useQA = () => {
  const query = ref('')
  const activeTab = ref('all')

  const wp = useWpStore()
  const { locale } = useI18n()

  type QaItem = { title: string; preview: string; answer: string }
  type QaCategory = { title: string; accent: string; items: QaItem[] }

  const stripHtml = (value: string) =>
    String(value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

  const accentPalette = ['var(--color-orange)', '#3B82F6', '#7A9C59', '#8B5CF6', '#14B8A6', '#EF4444']

  const queryChildren =
    'query GetQaChildCategories($parentId: Int!) {' +
    '\n  categories(where: { parent: $parentId, hideEmpty: true }, first: 100) {' +
    '\n    nodes { databaseId name slug }' +
    '\n  }' +
    '\n}'

  const queryChildrenFallback =
    'query GetQaChildCategoriesFallback($parentId: ID!) {' +
    '\n  category(id: $parentId, idType: DATABASE_ID) {' +
    '\n    children(first: 100) { nodes { databaseId name slug } }' +
    '\n  }' +
    '\n}'

  const queryPostsByCategory =
    'query GetQaPostsByCategory($first: Int!, $categoryId: Int!) {' +
    '\n  posts(first: $first, where: { categoryId: $categoryId, orderby: { field: DATE, order: DESC } }) {' +
    '\n    nodes { id title excerpt content }' +
    '\n  }' +
    '\n}'

  const fetchQaCategories = async () => {
    const parentCategoryId = 6

    let childCategories: Array<{ databaseId: number; name: string; slug?: string | null }> = []
    try {
      const res = await wp.query<{
        categories?: { nodes?: Array<{ databaseId?: number | null; name?: string | null; slug?: string | null }> }
      }>(queryChildren, { parentId: parentCategoryId }, { operationName: 'GetQaChildCategories' })

      childCategories =
        res.categories?.nodes
          ?.map((c) => ({
            databaseId: c.databaseId ?? 0,
            name: c.name ?? '',
            slug: c.slug ?? null,
          }))
          ?.filter((c) => c.databaseId && c.name) ?? []
    } catch {
      const res = await wp.query<{
        category?: {
          children?: { nodes?: Array<{ databaseId?: number | null; name?: string | null; slug?: string | null }> }
        } | null
      }>(queryChildrenFallback, { parentId: parentCategoryId }, { operationName: 'GetQaChildCategoriesFallback' })

      childCategories =
        res.category?.children?.nodes
          ?.map((c) => ({
            databaseId: c.databaseId ?? 0,
            name: c.name ?? '',
            slug: c.slug ?? null,
          }))
          ?.filter((c) => c.databaseId && c.name) ?? []
    }

    const categories = await Promise.all(
      childCategories.map(async (cat, idx) => {
        const posts = await wp.query<{
          posts?: { nodes?: Array<{ id: string; title?: string | null; excerpt?: string | null; content?: string | null }> }
        }>(queryPostsByCategory, { first: 200, categoryId: cat.databaseId }, { operationName: 'GetQaPostsByCategory' })

        const items =
          posts.posts?.nodes?.map((p) => {
            const preview = stripHtml(p.excerpt || p.content || '')
            const answer = stripHtml(p.content || p.excerpt || '')
            return {
              title: stripHtml(p.title || ''),
              preview,
              answer,
            }
          }) ?? []

        return {
          title: cat.name,
          accent: accentPalette[idx % accentPalette.length],
          items,
        }
      })
    )

    return categories.filter((c) => c.items.length > 0)
  }

  const { data: categoriesData, pending, error } = useAsyncData<QaCategory[]>(
    'qa:categories',
    () => fetchQaCategories() as Promise<QaCategory[]>,
    { watch: [locale], default: () => [] as QaCategory[], server: false }
  )

  const categories = computed<QaCategory[]>(() => categoriesData.value || [])

  const toAnchor = (title: string) =>
    title
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const filteredCategories = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return categories.value

    return categories.value
      .map((category) => {
        const items = category.items.filter((item) => {
          const haystack = `${item.title} ${item.preview} ${item.answer}`.toLowerCase()
          return haystack.includes(q)
        })
        return { ...category, items }
      })
      .filter((category) => category.items.length > 0)
  })

  watch(query, (value) => {
    if (value.trim()) activeTab.value = 'all'
  })

  const displayedCategories = computed(() => {
    const list = filteredCategories.value
    if (activeTab.value === 'all') return list
    return list.filter((c) => c.title === activeTab.value)
  })

  watch(activeTab, async (value) => {
    if (value === 'all') return
    await nextTick()
    if (!import.meta.client) return
    const el = document.getElementById(`qa-${toAnchor(value)}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })

  return {
    activeTab,
    query,
    categories,
    filteredCategories,
    displayedCategories,
    toAnchor,
    pending,
    error,
  }
};
