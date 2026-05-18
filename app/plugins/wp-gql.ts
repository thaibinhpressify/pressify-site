import { wpGraphqlRequest } from "~/utils/wpGraphql";

export type { WpGraphqlError, WpGraphqlResponse } from "~/utils/wpGraphql";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      wpGql: wpGraphqlRequest,
    },
  };
});
