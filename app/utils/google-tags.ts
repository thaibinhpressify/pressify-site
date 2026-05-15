import tagSiteJson from "../../public/tags/tag_site.json";

/** GTM Tag Assistant export (`public/tags/tag_site.json`). */
export const TAG_SITE_EXPORT = tagSiteJson;

type ConsentListItem = {
  type?: string;
  status?: string;
};

type GtmMessage = {
  eventNameKey?: string;
  consentData?: {
    consentList?: ConsentListItem[];
  };
};

type TagSiteExport = {
  name?: string;
  data?: {
    domainDetails?: {
      domainName?: string;
      startUrl?: string;
      containers?: string[];
    };
    containers?: Array<{
      publicId?: string;
      messages?: GtmMessage[];
    }>;
  };
};

const tagSite = tagSiteJson as TagSiteExport;

const domainDetails = tagSite.data?.domainDetails;
const primaryContainer = tagSite.data?.containers?.[0];

/** GTM container ID from Tag Assistant export (override via `NUXT_PUBLIC_GTM_ID`). */
export const GTM_CONTAINER_ID =
  domainDetails?.containers?.[0] ??
  primaryContainer?.publicId ??
  "GTM-KPF5R79W";

export const GTM_SITE_NAME = tagSite.name ?? domainDetails?.domainName ?? "pressify.us";

export const GTM_DOMAIN = domainDetails?.domainName ?? "pressify.us";

export const GTM_START_URL = domainDetails?.startUrl ?? "";

export const GTM_CONTAINER_IDS = domainDetails?.containers ?? [GTM_CONTAINER_ID];

/** Consent mode keys observed in the Tag Assistant export. */
export const GTM_CONSENT_TYPES = extractConsentTypes(primaryContainer?.messages ?? []);

/** GTM lifecycle event keys from the export (`gtm.load`, `gtm.dom`, …). */
export const GTM_LIFECYCLE_EVENTS = extractEventKeys(primaryContainer?.messages ?? []);

export const DATA_LAYER_NAME = "dataLayer";

export type DataLayerPayload = Record<string, unknown>;

export type GtmConsentStatus = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: DataLayerPayload[];
  }
}

function extractConsentTypes(messages: GtmMessage[]): string[] {
  const types = new Set<string>();
  for (const message of messages) {
    for (const item of message.consentData?.consentList ?? []) {
      if (item.type) types.add(item.type);
    }
  }
  return [...types];
}

function extractEventKeys(messages: GtmMessage[]): string[] {
  return [...new Set(messages.map((m) => m.eventNameKey).filter((k): k is string => Boolean(k)))];
}

/** Build consent payload from `tag_site.json` consent types. */
export function getGtmConsentPayload(status: GtmConsentStatus = "granted"): DataLayerPayload {
  const payload: DataLayerPayload = {};
  for (const type of GTM_CONSENT_TYPES) {
    payload[type] = status;
  }
  return payload;
}

/** Inline GTM bootstrap script (for `nuxt.config` head). */
export function getGtmInlineScript(
  containerId: string = GTM_CONTAINER_ID,
  dataLayer: string = DATA_LAYER_NAME,
): string {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','${dataLayer}','${containerId}');`;
}

/** GTM noscript iframe HTML (for `bodyOpen`). */
export function getGtmNoscriptHtml(containerId: string = GTM_CONTAINER_ID): string {
  return `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
}

/** Ensure `window.dataLayer` exists (client only). */
export function ensureDataLayer(): DataLayerPayload[] {
  if (import.meta.server) return [];
  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
}

/** Push a custom object to GTM dataLayer. */
export function pushToDataLayer(payload: DataLayerPayload): void {
  if (import.meta.server) return;
  ensureDataLayer().push(payload);
}

/** Push consent defaults aligned with Tag Assistant export. */
export function pushGtmConsentDefault(status: GtmConsentStatus = "granted"): void {
  pushToDataLayer({
    event: "gtm.init_consent",
    ...getGtmConsentPayload(status),
  });
}

/** Push a named GTM/GA4 event. */
export function trackGtmEvent(event: string, params: DataLayerPayload = {}): void {
  pushToDataLayer({ event, ...params });
}

/** Signup funnel — step viewed */
export function trackSignupStep(step: number, stepName?: string): void {
  trackGtmEvent("signup_step", {
    step,
    ...(stepName ? { step_name: stepName } : {}),
  });
}

/** Signup funnel — submission succeeded */
export function trackSignupComplete(params: DataLayerPayload = {}): void {
  trackGtmEvent("signup_complete", params);
}

/** Generic page view (if not handled by GTM auto-events). */
export function trackPageView(path: string, title?: string): void {
  trackGtmEvent("page_view", {
    page_path: path,
    ...(title ? { page_title: title } : {}),
  });
}
