import en from "./locales/en.json" assert { type: "json" }
import vi from "./locales/vi.json" assert { type: "json" }
export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en: {
      ...en,
    },
    vi: {
      ...vi
    },
  },
}))
