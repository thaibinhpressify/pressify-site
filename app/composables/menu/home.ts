import { computed } from "vue";

export function useMenu() {
  const { t } = useI18n();

  const menu = computed(() => [
    {
      name: t("home"),
      path: "/",
    },
    {
      name: t("catalog"),
      path: "/catalog",
    },
    {
      name: t("intergration"),
      path: "/intergration",
    },
    {
      name: t("about"),
      path: "/about",
    },
    {
      name: t("qa"),
      path: "/qa",
    },
    {
      name: t("news.title"),
      path: "/news",
    },
    {
      name: t("contact"),
      path: "/contact",
    },
  ]);

  const menuPage = ref([
    {
      name: t("about"),
      path: "/about",  
    },
    {
      name: t("footer.privacy-policy"),
      path: "/policy",
    },
    {
      name: t("footer.terms-of-service"),
      path: "/terms-of-service",
    }
  ]);

  const menuIntegrations = ref([
    {
      name: t("footer.tiktok"),
      path: "/tiktok",
    },
    {
      name: t("footer.pressify"),
      path: "/pressify",
    },
    {
      name: t("footer.csv"),
      path: "/csv",
    },
  ]);

  const menuShipping = ref([
    {
      name: t("footer.express-production"),
      path: "#",
    },
    {
      name: t("footer.express-shipping"),
      path: "#",
    },
  ]);

  return {
    menu,
    menuPage,
    menuIntegrations,
    menuShipping
  }
}
