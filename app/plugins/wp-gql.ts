export type WpGraphqlError = {
  message: string;
  extensions?: Record<string, unknown>;
};

export type WpGraphqlResponse<TData> = {
  data?: TData;
  errors?: WpGraphqlError[];
};

export default defineNuxtPlugin(() => {
  const wpGql = async <TData>(
    query: string,
    variables?: Record<string, unknown>,
    options?: { operationName?: string }
  ): Promise<TData> => {
    const result = await $fetch<WpGraphqlResponse<TData>>("/api/wp-graphql", {
      method: "POST",
      body: {
        query,
        variables,
        operationName: options?.operationName,
      },
    });

    if (result?.errors?.length) {
      const message = result.errors.map((e) => e.message).filter(Boolean).join("\n");
      throw new Error(message || "WP GraphQL request failed.");
    }

    if (!result?.data) {
      throw new Error("WP GraphQL returned no data.");
    }

    return result.data;
  };

  return {
    provide: {
      wpGql,
    },
  };
});
