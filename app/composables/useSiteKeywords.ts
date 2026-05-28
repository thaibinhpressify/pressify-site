/** Site-wide default meta keywords (env override → i18n). */
export function useSiteKeywords() {
  const config = useRuntimeConfig();
  const { t } = useI18n();

  return computed(() => {
    const fromEnv = String(config.public.siteKeywords || "").trim();
    if (fromEnv) return fromEnv;
    return String(t("seo.keywords") || "").trim();
  });
}
