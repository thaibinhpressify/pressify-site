const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_DAILY_ORDER_BANDS = new Set(["under_1", "1_10", "11_50", "51_200", "over_200"]);

type SignupLeadBody = {
  storeName?: string;
  platforms?: unknown;
  avgDailyOrders?: string;
  channel?: string;
  products?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  other?: string;
  note?: string;
};

export default defineEventHandler(async (event) => {
  assertMethod(event, "POST");
  const body = (await readBody(event)) as SignupLeadBody;

  const storeName = String(body.storeName || "").trim();
  const platforms = Array.isArray(body.platforms)
    ? body.platforms.filter((p): p is string => typeof p === "string" && p.length > 0)
    : [];
  const avgDailyOrders = String(body.avgDailyOrders || "").trim();
  const channel = String(body.channel || "").trim();
  const products = String(body.products || "").trim();
  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const facebook = String(body.facebook || "").trim();
  const other = String(body.other || "").trim();
  const note = String(body.note || "").trim();
  if (storeName.length < 2) {
    throw createError({ statusCode: 400, statusMessage: "Invalid storeName" });
  }
  if (!platforms.length) {
    throw createError({ statusCode: 400, statusMessage: "Invalid platforms" });
  }
  if (!avgDailyOrders || !ALLOWED_DAILY_ORDER_BANDS.has(avgDailyOrders)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid avgDailyOrders" });
  }
  if (!channel) {
    throw createError({ statusCode: 400, statusMessage: "Invalid channel" });
  }
  if (products.length < 3) {
    throw createError({ statusCode: 400, statusMessage: "Invalid products" });
  }
  if (fullName.length < 2) {
    throw createError({ statusCode: 400, statusMessage: "Invalid fullName" });
  }
  if (!EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid email" });
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    throw createError({ statusCode: 400, statusMessage: "Invalid phone" });
  }

  const config = useRuntimeConfig();
  const base = String(config.sellerApiBase || "").replace(/\/$/, "");
  if (!base) {
    throw createError({
      statusCode: 500,
      statusMessage: "Seller API base URL is not configured.",
    });
  }

  const url = `${base}/sellers`;
  /** snake_case for typical Python/FastAPI sellers API */
  const payload = {
    store_name: storeName,
    platforms,
    avg_daily_orders: avgDailyOrders,
    channel,
    products,
    full_name: fullName,
    email,
    phone,
    ...(facebook ? { facebook } : {}),
    ...(other ? { other } : {}),
    ...(note ? { note } : {}),
  };

  try {
    return await $fetch(url, {
      method: "POST",
      body: payload,
    });
  } catch (err: unknown) {
    const e = err as {
      statusCode?: number;
      status?: number;
      statusMessage?: string;
      message?: string;
      data?: unknown;
    };
    const statusCode = e.statusCode ?? e.status ?? 502;
    const statusMessage = e.statusMessage || e.message || "Seller API request failed";
    throw createError({
      statusCode,
      statusMessage,
      data: e.data,
    });
  }
});
