export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<{
    query?: string;
    variables?: Record<string, unknown>;
    operationName?: string;
  }>(event);

  const endpoint = config.wpGraphqlEndpoint || config.public.wpGraphqlEndpoint;
  if (!endpoint) {
    throw createError({
      statusCode: 500,
      statusMessage: "WP GraphQL endpoint is not configured.",
    });
  }

  const headers: Record<string, string> = {
    "content-type": "application/json",
  };

  if (config.wpGraphqlToken) {
    headers.authorization = `Bearer ${config.wpGraphqlToken}`;
  }

  const requestBody = {
    query: body?.query,
    variables: body?.variables,
    operationName: body?.operationName,
  };

  const candidates = (() => {
    const list = [endpoint];
    if (endpoint.includes("?graphql")) return list;

    try {
      const url = new URL(endpoint);
      if (url.pathname.endsWith("/graphql")) {
        const base = endpoint.replace(/\/graphql$/, "");
        list.push(`${base}/?graphql`);
        list.push(`${base}/index.php?graphql`);
      }
    } catch {
      return list;
    }

    return list;
  })();

  let lastError: unknown;
  for (const url of candidates) {
    try {
      const response = await $fetch(url, {
        method: "POST",
        headers,
        body: requestBody,
      });
      return response;
    } catch (e: unknown) {
      lastError = e;
      const status = (e as { statusCode?: number; response?: { status?: number } })?.statusCode ??
        (e as { response?: { status?: number } })?.response?.status;
      if (status !== 404) throw e;
    }
  }

  throw lastError;

});
