declare module "#app" {
  interface NuxtApp {
    $wpGql: <TData>(
      query: string,
      variables?: Record<string, unknown>,
      options?: { operationName?: string }
    ) => Promise<TData>;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $wpGql: <TData>(
      query: string,
      variables?: Record<string, unknown>,
      options?: { operationName?: string }
    ) => Promise<TData>;
  }
}

export {};
