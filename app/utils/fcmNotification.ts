import type { MessagePayload } from "firebase/messaging";

/** Backend FCM `data` fields (all values must be strings in FCM HTTP v1). */
export type FcmNotificationData = {
  click_url?: string;
  clickUrl?: string;
  title?: string;
  body?: string;
  icon?: string;
  image?: string;
  tag?: string;
  type?: string;
  [key: string]: string | undefined;
};

export type FcmDisplayNotification = {
  title: string;
  body: string;
  icon: string;
  image?: string;
  clickUrl: string;
  tag: string;
  data: Record<string, string>;
};

const DEFAULT_ICON = "/logo.png";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringDataRecord(data: Record<string, unknown> | undefined): Record<string, string> {
  if (!data) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    out[key] = String(value);
  }
  return out;
}

/** Relative or absolute URL → absolute using site base. */
export function resolveFcmClickUrl(clickUrl: string, siteUrl: string): string {
  const raw = clickUrl.trim();
  const base = siteUrl.trim().replace(/\/+$/, "");
  if (!raw) return base || "/";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/")) return `${base}${raw}`;
  return `${base}/${raw}`;
}

export function parseFcmDisplayNotification(
  payload: MessagePayload,
  siteUrl: string,
  siteName = "Pressify"
): FcmDisplayNotification {
  const data = stringDataRecord(payload.data as Record<string, unknown> | undefined);
  const notification = payload.notification;

  const title =
    asString(notification?.title) ||
    asString(data.title) ||
    siteName;

  const body =
    asString(notification?.body) ||
    asString(data.body) ||
    "";

  const icon =
    asString(notification?.icon) ||
    asString(data.icon) ||
    DEFAULT_ICON;

  const image =
    asString((notification as { image?: string } | undefined)?.image) ||
    asString(data.image) ||
    undefined;

  const clickRaw =
    asString(data.click_url) ||
    asString(data.clickUrl) ||
    asString((payload as { fcmOptions?: { link?: string } }).fcmOptions?.link);

  const clickUrl = resolveFcmClickUrl(clickRaw, siteUrl);

  const tag = asString(data.tag) || `pressify-${Date.now()}`;

  return {
    title,
    body,
    icon,
    image: image || undefined,
    clickUrl,
    tag,
    data: {
      ...data,
      click_url: clickUrl,
      title,
      body,
      icon,
      ...(image ? { image } : {}),
      tag,
    },
  };
}

export function toWebNotificationOptions(
  display: FcmDisplayNotification
): NotificationOptions {
  return {
    body: display.body || undefined,
    icon: display.icon,
    image: display.image,
    tag: display.tag,
    data: display.data,
    requireInteraction: false,
  };
}

export function openFcmClickUrl(clickUrl: string): void {
  if (!import.meta.client) return;
  try {
    const target = new URL(clickUrl, window.location.origin);
    const sameOrigin = target.origin === window.location.origin;

    if (sameOrigin) {
      window.location.assign(target.href);
      return;
    }

    window.open(target.href, "_blank", "noopener,noreferrer");
  } catch {
    window.open(clickUrl, "_blank", "noopener,noreferrer");
  }
}
