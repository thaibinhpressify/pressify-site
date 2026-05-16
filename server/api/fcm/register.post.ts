const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEVICE_ID_RE = /^[a-zA-Z0-9_-]{8,128}$/;

type FcmRegisterBody = {
  fcmToken?: string;
  deviceId?: string;
  locale?: string;
  platform?: string;
  userAgent?: string;
  userId?: string;
  email?: string;
  siteUrl?: string;
};

export default defineEventHandler(async (event) => {
  assertMethod(event, "POST");
  const body = (await readBody(event)) as FcmRegisterBody;

  const fcmToken = String(body.fcmToken || "").trim();
  const deviceId = String(body.deviceId || "").trim();
  const locale = String(body.locale || "").trim();
  const platform = String(body.platform || "web").trim();
  const userAgent = String(body.userAgent || "").trim();
  const userId = String(body.userId || "").trim();
  const email = String(body.email || "").trim();
  const siteUrl = String(body.siteUrl || "").trim();

  if (fcmToken.length < 80) {
    throw createError({ statusCode: 400, statusMessage: "Invalid fcmToken" });
  }
  if (!DEVICE_ID_RE.test(deviceId)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid deviceId" });
  }
  if (email && !EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid email" });
  }

  const config = useRuntimeConfig();
  const base = String(
    config.sellerApiBase || ""
  ).replace(/\/$/, "");

  if (!base) {
    throw createError({
      statusCode: 500,
      statusMessage: "Pressify API base URL is not configured.",
    });
  }

  const payload = {
    fcm_token: fcmToken,
    device_id: deviceId,
    platform,
    ...(locale ? { locale } : {}),
    ...(userAgent ? { user_agent: userAgent } : {}),
    ...(siteUrl ? { site_url: siteUrl } : {}),
    ...(userId ? { user_id: userId } : {}),
    ...(email ? { email } : {}),
  };

  try {
    return await $fetch(`${base}/register_fcm`, {
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
    const statusMessage = e.statusMessage || e.message || "Pressify API request failed";
    throw createError({
      statusCode,
      statusMessage,
      data: e.data,
    });
  }
});
