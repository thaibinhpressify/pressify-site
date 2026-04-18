export const useQA = () => {
  const query = ref('')
  const activeTab = ref('all')

  const categories = [
    {
      title: 'Orders & Shipping',
      accent: 'var(--color-orange)',
      items: [
        {
          title: 'How long does production take?',
          preview:
            'Standard production is 3–5 business days. Rush orders (1–2 days) are available for most products at a small upcharge.',
          answer:
            'Production time depends on the product type and quantity. If you select rush production, we prioritize your order and produce within 1–2 business days.',
        },
        {
          title: 'Do you offer international shipping?',
          preview:
            'Yes! We ship to 50+ countries. Rates are calculated at checkout based on weight and destination.',
          answer:
            'International shipping is available for most destinations. Customs and import duties may apply depending on your country.',
        },
        {
          title: 'Can I track my order in real time?',
          preview:
            "Absolutely. You'll receive a tracking link via email once your order ships. Live updates every 2 hours.",
          answer:
            "Once shipped, you'll get a carrier tracking link. Tracking events depend on the carrier, but updates typically appear within a few hours.",
        },
      ],
    },
    {
      title: 'Products & Pricing',
      accent: '#3B82F6',
      items: [
        {
          title: 'What file formats do you accept?',
          preview:
            'We accept PDF, AI, EPS, PSD, and TIFF. All files should be submitted at 300 DPI minimum with bleed marks.',
          answer:
            'We recommend PDF for best results. Please ensure CMYK color mode and include 3mm bleed on all sides when applicable.',
        },
        {
          title: 'Is there a minimum order quantity?',
          preview:
            'Most products have a minimum of 25 units. Custom packaging starts at 100 units.',
          answer:
            'Minimum order quantity depends on the product type. Contact support if you need a smaller test run.',
        },
        {
          title: 'Do you offer volume discounts?',
          preview:
            'Yes — orders over 500 units receive 15% off. Contact our team for enterprise pricing.',
          answer:
            'Discount tiers vary by product and quantity. Reach out and we’ll prepare a quote for your order.',
        },
      ],
    },
    {
      title: 'Design & Files',
      accent: '#7A9C59',
      items: [
        {
          title: 'Can you help design my artwork?',
          preview: 'Yes! Our design team creates print-ready artwork from your brief. Starts at $49/project with 2 revision rounds.',
          answer:
            'Share your idea, brand assets, and references. We’ll deliver print-ready files and include 2 revision rounds to fine-tune details.',
        },
        {
          title: 'What color profile should I use?',
          preview: 'Use CMYK color mode for all print files. RGB files will be auto-converted, which may shift colors slightly.',
          answer:
            'CMYK provides the most accurate print results. If you submit RGB, we’ll convert it, but colors may look different on paper.',
        },
      ],
    },
    {
      title: 'Account & Billing',
      accent: 'var(--color-orange)',
      items: [
        {
          title: 'What payment methods do you accept?',
          preview: 'We accept Visa, Mastercard, PayPal, and bank transfer for orders over $500.',
          answer:
            'Payment options can vary by country. For large orders, bank transfer is supported and invoices can be provided upon request.',
        },
        {
          title: 'Can I get an invoice for my order?',
          preview: 'Yes, invoices are auto-generated and emailed upon payment. Download them anytime from your account dashboard.',
          answer:
            'Invoices are available in your dashboard after checkout. If you need additional details (VAT, company info), contact support.',
        },
      ],
    },
  ]

  const toAnchor = (title: string) =>
    title
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const filteredCategories = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return categories

    return categories
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
    toAnchor
  }
};