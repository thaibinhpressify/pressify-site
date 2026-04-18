export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing product id" });
  }

  const config = useRuntimeConfig();
  const base = String(config.pressifyApiBase || config.public.pressifyApiBase || "").replace(/\/$/, "");
  if (!base) {
    throw createError({
      statusCode: 500,
      statusMessage: "Pressify API base URL is not configured.",
    });
  }

  const url = `${base}/api/product/${encodeURIComponent(id)}`;
  const response = await $fetch(url, { method: "GET" });
  return response;
});
