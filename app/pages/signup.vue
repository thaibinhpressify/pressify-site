<template>
  <div class="signup-root flex min-h-screen flex-col bg-white text-black-100">
    <div class="container mx-auto">
      <div class="flex flex-col lg:flex-row">
        <!-- Form column -->
        <section
          class="order-1 flex w-full flex-1 flex-col px-5 pb-10 pt-6 sm:px-10 lg:order-1 lg:max-w-[46%] lg:px-12 lg:pb-12 lg:pt-10"
        >
          <div class="mb-8 flex items-center justify-between gap-4">
            <NuxtLink
              :to="localePath('/')"
              class="text-sm font-medium text-blue hover:underline"
            >
              ← {{ t("signupPage.back") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/contact')"
              class="hidden text-sm text-blue hover:underline sm:inline"
            >
              {{ t("signupPage.contactLink") }}
            </NuxtLink>
          </div>

          <div class="mx-auto flex w-full max-w-md flex-1 flex-col">
            <NuxtLink :to="localePath('/')" class="mb-6 flex justify-center">
              <img class="h-12 w-auto" src="/logo.png" alt="Pressify" width="160" height="48" />
            </NuxtLink>

            <p v-if="!showThanks" class="mb-8 text-center text-sm leading-relaxed text-gray">
              {{ t("signupPage.tagline") }}
              <NuxtLink :to="localePath('/contact')" class="text-blue hover:underline">
                {{ t("signupPage.contactLink") }}
              </NuxtLink>
            </p>

            <template v-if="!showThanks">
              <p class="mb-4 text-center text-xs font-medium uppercase tracking-wide text-gray-100">
                {{ t("signupPage.stepOf", { current: step, total: totalSteps }) }}
              </p>

              <div class="mb-6 h-1 w-full overflow-hidden rounded-full bg-white-200">
                <div
                  class="h-full rounded-full bg-orange transition-all duration-300 ease-out"
                  :style="{ width: `${(step / totalSteps) * 100}%` }"
                />
              </div>

              <p v-if="stepError" class="mb-4 rounded-lg bg-red/10 px-3 py-2 text-center text-sm text-red">
                {{ stepError }}
              </p>
            </template>

            <Transition name="signup-step" mode="out-in">
              <div v-if="showThanks" key="thanks" class="signup-thanks mt-2 flex flex-1 flex-col items-center text-center">
                <div
                  class="signup-thanks-icon mb-6 flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full bg-green/12 text-green"
                  aria-hidden="true"
                >
                  <svg class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h1 class="mb-3 text-2xl font-bold tracking-tight text-black-100 sm:text-[1.65rem]">
                  {{ t("signupPage.thanks.title") }}
                </h1>
                <p class="mb-2 max-w-sm text-base font-medium text-black-100/90">
                  {{ t("signupPage.thanks.subtitle") }}
                </p>
                <p class="mb-6 max-w-sm text-sm leading-relaxed text-gray">
                  {{ t("signupPage.thanks.body") }}
                </p>
                <p v-if="thanksEmail" class="mb-8 max-w-sm rounded-xl bg-white-100 px-4 py-3 text-sm text-gray">
                  {{ t("signupPage.thanks.emailHint", { email: thanksEmail }) }}
                </p>
                <div class="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
                  <NuxtLink
                    :to="localePath('/')"
                    class="btn flex-1 border-0 bg-orange text-white hover:bg-orange/90"
                  >
                    {{ t("signupPage.thanks.ctaHome") }}
                  </NuxtLink>
                  <NuxtLink
                    :to="localePath('/catalog')"
                    class="btn btn-outline flex-1 border-gray-200 bg-white-100 text-black-100 hover:border-gray-300 hover:bg-white-200"
                  >
                    {{ t("signupPage.thanks.ctaCatalog") }}
                  </NuxtLink>
                </div>
              </div>

              <div v-else :key="step" class="flex flex-1 flex-col">
                <!-- Step 1 -->
                <template v-if="step === 1">
                  <h1 class="mb-6 text-xl font-semibold text-black-100">
                    {{ t("signupPage.steps.store.title") }}
                  </h1>
                  <div class="signup-field-wrap">
                    <label class="signup-label">
                      {{ t("signupPage.steps.store.label") }}
                    </label>
                    <input
                      v-model="form.storeName"
                      type="text"
                      autocomplete="organization"
                      class="signup-field"
                      :placeholder="t('signupPage.steps.store.placeholder')"
                      @keydown.enter="onPrimary"
                    />
                  </div>
                </template>

                <!-- Step 2 -->
                <template v-else-if="step === 2">
                  <h1 class="mb-2 text-xl font-semibold text-black-100">
                    {{ t("signupPage.steps.platform.title") }}
                  </h1>
                  <p class="mb-6 text-sm text-gray">{{ t("signupPage.steps.platform.hint") }}</p>
                  <div class="flex flex-col gap-3">
                    <label
                      v-for="id in platformIds"
                      :key="id"
                      class="signup-option"
                    >
                      <input v-model="form.platforms" type="checkbox" class="signup-check" :value="id" />
                      <span class="signup-option-text">{{ t(`signupPage.platforms.${id}`) }}</span>
                    </label>
                  </div>
                </template>

                <!-- Step 3 -->
                <template v-else-if="step === 3">
                  <h1 class="mb-2 text-xl font-semibold text-black-100">
                    {{ t("signupPage.steps.dailyOrders.title") }}
                  </h1>
                  <p class="mb-6 text-sm text-gray">{{ t("signupPage.steps.dailyOrders.hint") }}</p>
                  <div class="flex flex-col gap-3">
                    <label
                      v-for="id in dailyOrderBandIds"
                      :key="id"
                      class="signup-option"
                    >
                      <input v-model="form.avgDailyOrders" type="radio" name="avgDailyOrders" class="signup-radio" :value="id" />
                      <span class="signup-option-text">{{ t(`signupPage.dailyOrders.${id}`) }}</span>
                    </label>
                  </div>
                </template>

                <!-- Step 4 -->
                <template v-else-if="step === 4">
                  <h1 class="mb-2 text-xl font-semibold text-black-100">
                    {{ t("signupPage.steps.channel.title") }}
                  </h1>
                  <p class="mb-6 text-sm text-gray">{{ t("signupPage.steps.channel.hint") }}</p>
                  <div class="flex flex-col gap-3">
                    <label
                      v-for="id in channelIds"
                      :key="id"
                      class="signup-option"
                    >
                      <input v-model="form.channel" type="radio" name="channel" class="signup-radio" :value="id" />
                      <span class="signup-option-text">{{ t(`signupPage.channels.${id}`) }}</span>
                    </label>
                  </div>
                </template>

                <!-- Step 5 -->
                <template v-else-if="step === 5">
                  <h1 class="mb-6 text-xl font-semibold text-black-100">
                    {{ t("signupPage.steps.products.title") }}
                  </h1>
                  <textarea
                    v-model="form.products"
                    rows="6"
                    class="signup-field signup-field--textarea resize-y"
                    :placeholder="t('signupPage.steps.products.placeholder')"
                  />
                </template>

                <!-- Step 6 -->
                <template v-else-if="step === 6">
                  <h1 class="mb-2 text-xl font-semibold text-black-100">
                    {{ t("signupPage.steps.account.title") }}
                  </h1>
                  <p class="mb-6 text-sm text-gray">{{ t("signupPage.steps.account.subtitle") }}</p>
                  <div class="flex flex-col gap-5">
                    <div class="signup-field-wrap">
                      <label class="signup-label" for="signup-fullName">
                        {{ t("signupPage.steps.account.fullName") }}
                        <span class="text-red" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="signup-fullName"
                        v-model="form.fullName"
                        type="text"
                        autocomplete="name"
                        required
                        class="signup-field"
                        :class="{ 'signup-field--invalid': fieldErrors.fullName }"
                        :aria-invalid="fieldErrors.fullName ? 'true' : undefined"
                        @input="fieldErrors.fullName = ''"
                      />
                      <p v-if="fieldErrors.fullName" class="signup-field-error" role="alert">
                        {{ fieldErrors.fullName }}
                      </p>
                    </div>
                    <div class="signup-field-wrap">
                      <label class="signup-label" for="signup-email">
                        {{ t("signupPage.steps.account.email") }}
                        <span class="text-red" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="signup-email"
                        v-model="form.email"
                        type="email"
                        autocomplete="email"
                        required
                        class="signup-field"
                        :class="{ 'signup-field--invalid': fieldErrors.email }"
                        :aria-invalid="fieldErrors.email ? 'true' : undefined"
                        @input="fieldErrors.email = ''"
                      />
                      <p v-if="fieldErrors.email" class="signup-field-error" role="alert">
                        {{ fieldErrors.email }}
                      </p>
                    </div>
                    <div class="signup-field-wrap">
                      <label class="signup-label" for="signup-phone">
                        {{ t("signupPage.steps.account.phone") }}
                        <span class="text-red" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="signup-phone"
                        v-model="form.phone"
                        type="tel"
                        autocomplete="tel"
                        required
                        class="signup-field"
                        :class="{ 'signup-field--invalid': fieldErrors.phone }"
                        :aria-invalid="fieldErrors.phone ? 'true' : undefined"
                        @input="fieldErrors.phone = ''"
                      />
                      <p v-if="fieldErrors.phone" class="signup-field-error" role="alert">
                        {{ fieldErrors.phone }}
                      </p>
                    </div>
                    <div class="signup-field-wrap">
                      <label class="signup-label">{{ t("signupPage.steps.account.facebook") }}</label>
                      <input v-model="form.facebook" type="text" autocomplete="username" class="signup-field" />
                    </div>
                    <div class="signup-field-wrap">
                      <label class="signup-label">{{ t("signupPage.steps.account.other") }}</label>
                      <input v-model="form.other" type="text" autocomplete="off" class="signup-field" />
                    </div>
                  </div>
                </template>
              </div>
            </Transition>

            <div v-if="!showThanks" class="mt-auto flex flex-col gap-3 pt-10">
              <button
                type="button"
                class="btn w-full border-0 bg-orange text-white hover:bg-orange/90"
                :disabled="submitting"
                @click="onPrimary"
              >
                <span v-if="submitting" class="loading loading-spinner loading-sm" />
                <span v-else class="text-white">{{ step < totalSteps ? t("signupPage.next") : t("signupPage.submit") }}</span>
              </button>
              <button
                v-if="step > 1 && !showThanks"
                type="button"
                class="btn btn-outline border-gray-200 bg-white-100 text-black-100 hover:border-gray-200 hover:bg-white-200"
                :disabled="submitting"
                @click="goBack"
              >
                ← {{ t("signupPage.back") }}
              </button>
            </div>
          </div>

          <footer class="mx-auto mt-12 max-w-md text-center text-xs text-gray">
            {{ t("signupPage.footer.rights", { year: currentYear }) }}
            <NuxtLink :to="localePath('/terms-of-service')" class="text-blue hover:underline">
              {{ t("signupPage.footer.terms") }}
            </NuxtLink>
            {{ " · " }}
            <NuxtLink :to="localePath('/policy')" class="text-blue hover:underline">
              {{ t("signupPage.footer.policy") }}
            </NuxtLink>
          </footer>
        </section>

        <!-- Promo column -->
        <aside
          class="order-2 flex min-h-[320px] w-full flex-col justify-center text-white lg:order-2 lg:min-h-screen lg:max-w-[54%] lg:flex-1"
        >

          <div class="border-t border-white/10 bg-white-100 text-black-100 rounded-[15px] overflow-hidden">
            <NuxtLink :to="localePath(`/${(activeSlide as any).slug}`)">
              <img :src="(activeSlide as any).thumbnail" :alt="(activeSlide as any).title"
                class="h-[300px] lg:h-[500px] w-full object-cover" />
            </NuxtLink>
            <div class="p-[15px]">
              <h2 class="text-lg font-semibold text-black-100">{{ activeSlide.title }}</h2>
              <p class="mt-2 text-sm leading-relaxed text-gray" v-html="activeSlide.desc"></p>
              <div class="mt-6 flex flex-wrap items-center gap-4">
                <div class="flex gap-2">
                  <button
                    v-for="i in slideCount"
                    :key="i"
                    type="button"
                    class="h-2.5 w-2.5 rounded-full transition-colors"
                    :class="promoIndex === i - 1 ? 'bg-orange' : 'bg-gray-200'"
                    :aria-label="`Slide ${i}`"
                    @click="promoIndex = i - 1"
                  />
                </div>
              </div>
              </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from "vue3-hot-toast";
import { useWpStore } from "~~/stores/wp";

definePageMeta({
  layout: "signup",
});

const { t, locale } = useI18n()

if (locale.value == 'en') {
  useSeoMeta({
    title: t("signupPage.seoTitle"),
    description: t("news.description"),
    ogTitle: 'Signup',
    ogDescription: 'Signup to Pressify.',
  })
} else {
  useSeoMeta({
    title: t("news.title"),
    description: t("news.description"),
    ogTitle: t("news.title"),
    ogDescription: t("news.description"),
  })
}

const localePath = useLocalePath();
const config = useRuntimeConfig();

const totalSteps = 6;
const step = ref(1);
const stepError = ref("");
const submitting = ref(false);
const showThanks = ref(false);
const thanksEmail = ref("");

const fieldErrors = reactive({
  fullName: "",
  email: "",
  phone: "",
});

const platformIds = ["etsy", "amazon", "tiktok", "shopify", "google_shopping", "other"] as const;
const dailyOrderBandIds = ["1_10", "11_50", "51_200", "over_200"] as const;
const channelIds = ["facebook", "google", "gpt", "site", "event"] as const;

const form = reactive({
  storeName: "",
  platforms: [] as string[],
  avgDailyOrders: "",
  channel: "",
  products: "",
  fullName: "",
  email: "",
  phone: "",
  facebook: "",
  other: "",

});

const currentYear = new Date().getFullYear();

const promoIndex = ref(0);
const slideCount = 3;
const wp = useWpStore()
const router = useRouter();

const { data } = await useAsyncData(
  'news:category:3',
  async () => {
    const query =
      'query GetNewsByCategory($first: Int!, $categoryId: Int!) {' +
      '\n  posts(first: $first, where: { categoryId: $categoryId, orderby: { field: DATE, order: DESC } }) {' +
      '\n    nodes {' +
      '\n      id' +
      '\n      title' +
      '\n      slug' +
      '\n      excerpt' +
      '\n      date' +
      '\n      featuredImage { node { sourceUrl } }' +
      '\n      categories { nodes { name } }' +
      '\n    }' +
      '\n  }' +
      '\n}'

    const result = await wp.query(
      query,
      { first: 12, categoryId: locale.value == 'en' ? 3 : 5 },
      { operationName: 'GetNewsByCategory' }
    )

    return (
      (result as any).posts?.nodes?.map((p: any) => ({
        thumbnail: p?.featuredImage?.node?.sourceUrl ?? '',
        title: p?.title ?? '',
        category: p?.categories?.nodes?.[0]?.name ?? '',
        excerpt: p?.excerpt ?? '',
        time: p?.date ?? '',
        slug: p?.slug ?? ''
      })) ?? []
    )
  },
  { watch: [locale], server: false }
)

const posts = computed(() => data.value ?? [])
type Slide = { title: string; desc: string };

const promoSlides = computed<Slide[]>(() => {
  return posts.value.map((p: { title: string; thumbnail: string; excerpt: string; slug: string }) => ({
    title: p.title,
    thumbnail: p.thumbnail,
    desc: p.excerpt,
    slug: p.slug,
  }));
});

const activeSlide = computed(() => {
  const slides = promoSlides.value;
  if (!slides.length) {
    return { title: "", desc: "" };
  }
  return slides[promoIndex.value % slides.length]!;
});

function tmHero(key: string) {
  return t(`signupPage.promo.${key}`);
}

let promoTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  promoTimer = setInterval(() => {
    const n = promoSlides.value.length || slideCount;
    promoIndex.value = (promoIndex.value + 1) % n;
  }, 6500);
});

onUnmounted(() => {
  if (promoTimer) clearInterval(promoTimer);
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function clearAccountFieldErrors() {
  fieldErrors.fullName = "";
  fieldErrors.email = "";
  fieldErrors.phone = "";
}

function validateAccountStep(): boolean {
  clearAccountFieldErrors();
  let valid = true;

  const fullName = form.fullName.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();

  if (!fullName) {
    fieldErrors.fullName = err("required");
    valid = false;
  } else if (fullName.length < 2) {
    fieldErrors.fullName = err("required");
    valid = false;
  }

  if (!email) {
    fieldErrors.email = err("required");
    valid = false;
  } else if (!EMAIL_RE.test(email)) {
    fieldErrors.email = err("email");
    valid = false;
  }

  if (!phone) {
    fieldErrors.phone = err("required");
    valid = false;
  } else if (!isValidPhone(phone)) {
    fieldErrors.phone = err("phone");
    valid = false;
  }

  if (!valid) {
    stepError.value = err("required");
  }

  return valid;
}

function err(key: string) {
  return t(`signupPage.errors.${key}`);
}

function validateCurrent(): boolean {
  stepError.value = "";
  switch (step.value) {
    case 1:
      if (form.storeName.trim().length < 2) {
        stepError.value = err("required");
        return false;
      }
      break;
    case 2:
      if (!form.platforms.length) {
        stepError.value = err("pickOne");
        return false;
      }
      break;
    case 3:
      if (!form.avgDailyOrders) {
        stepError.value = err("pickOne");
        return false;
      }
      break;
    case 4:
      if (!form.channel) {
        stepError.value = err("pickOne");
        return false;
      }
      break;
    case 5:
      if (form.products.trim().length < 3) {
        stepError.value = err("required");
        return false;
      }
      break;
    case 6:
      return validateAccountStep();
    default:
      break;
  }
  return true;
}

function goBack() {
  stepError.value = "";
  clearAccountFieldErrors();
  if (step.value > 1) step.value -= 1;
}

async function onPrimary() {
  if (!validateCurrent()) return;
  if (step.value < totalSteps) {
    step.value += 1;
    return;
  }
  submitting.value = true;
  try {
    await $fetch("/api/signup-lead", {
      method: "POST",
      body: {
        ...form,
        note: router.currentRoute.value.query.voucher ? `Voucher: ${router.currentRoute.value.query.voucher}` : '',
      },
    });
    thanksEmail.value = form.email.trim();
    showThanks.value = true;
  } catch {
    toast.error(t("signupPage.errors.submitFailed"));
  } finally {
    submitting.value = false;
  }
}

const siteName = computed(() => String(config.public.siteName || "Pressify"));

useHead(() => ({
  title: t("signupPage.seoTitle"),
}));

useSeoMeta({
  title: computed(() => `${t("signupPage.seoTitle")} · ${siteName.value}`),
  description: computed(() => t("signupPage.tagline")),
  ogTitle: computed(() => `${t("signupPage.seoTitle")} · ${siteName.value}`),
  ogLocale: computed(() => locale.value),
});
</script>

<style scoped>
.signup-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #171717;
}

.signup-field {
  display: block;
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #e9e6e0;
  background-color: #fafaf8;
  padding: 0.8125rem 1rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #171717;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}

.signup-field::placeholder {
  color: #888888;
}

.signup-field:hover {
  border-color: #d0ccc4;
  background-color: #ffffff;
}

.signup-field:focus {
  outline: none;
  border-color: #ff7900;
  background-color: #ffffff;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.04),
    0 0 0 3px rgb(255 121 0 / 0.2);
}

.signup-field--invalid {
  border-color: #ff0000;
  background-color: #fff8f8;
}

.signup-field--invalid:focus {
  border-color: #ff0000;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.04),
    0 0 0 3px rgb(255 0 0 / 0.15);
}

.signup-field-error {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #ff0000;
}

.signup-field--textarea {
  min-height: 9rem;
  padding-top: 0.875rem;
  padding-bottom: 0.875rem;
}

.signup-option {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e9e6e0;
  background-color: #fafaf8;
  padding: 0.875rem 1rem;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.03);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}

.signup-option:hover {
  border-color: #d0ccc4;
  background-color: #ffffff;
}

.signup-option:has(:checked) {
  border-color: #ff7900;
  background-color: rgb(255 121 0 / 0.07);
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.04),
    0 0 0 1px rgb(255 121 0 / 0.35);
}

.signup-option-text {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.4;
  color: #171717;
}

.signup-check,
.signup-radio {
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
}

.signup-check {
  border-radius: 0.3rem;
}

.signup-step-enter-active,
.signup-step-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.signup-step-enter-from,
.signup-step-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
