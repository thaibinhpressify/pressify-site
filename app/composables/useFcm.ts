import {
  FCM_DEVICE_ID_KEY,
  FCM_TOKEN_CACHE_KEY,
  getFirebaseApp,
  getPublicFirebaseConfig,
} from "~/utils/firebase";
import {
  openFcmClickUrl,
  parseFcmDisplayNotification,
  toWebNotificationOptions,
} from "~/utils/fcmNotification";

export type FcmRegisterOptions = {
  userId?: string;
  email?: string;
  /** Re-send token to server even when unchanged (e.g. after login). */
  force?: boolean;
};

let foregroundMessageListenerAttached = false;

function resolveCurrentLocale(): string {
  try {
    const i18n = useNuxtApp().$i18n as { locale?: string | { value: string } } | undefined;
    const locale = i18n?.locale;
    if (typeof locale === "string" && locale) return locale;
    if (locale && typeof locale === "object" && "value" in locale && locale.value) {
      return locale.value;
    }
  } catch {
    /* outside Nuxt context */
  }

  if (import.meta.client) {
    const match = window.location.pathname.match(/^\/(en|vi)(\/|$)/);
    if (match?.[1]) return match[1];
  }

  return "en";
}

function attachForegroundMessageListener(
  messaging: import("firebase/messaging").Messaging,
  siteUrl: string,
  siteName: string
): void {
  if (foregroundMessageListenerAttached) return;
  foregroundMessageListenerAttached = true;

  void import("firebase/messaging").then(({ onMessage }) => {
    onMessage(messaging, (payload) => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const display = parseFcmDisplayNotification(payload, siteUrl, siteName);
      if (!display.body && !display.title) return;

      const notification = new Notification(display.title, toWebNotificationOptions(display));

      notification.onclick = (event) => {
        event.preventDefault();
        notification.close();
        openFcmClickUrl(display.clickUrl);
      };
    });
  });
}

export function useFcm() {
  const config = useRuntimeConfig();
  const siteUrl = String(config.public.siteUrl || "").trim().replace(/\/+$/, "");
  const siteName = String(config.public.siteName || "Pressify");

  function getOrCreateDeviceId(): string {
    if (!import.meta.client) return "";
    let id = localStorage.getItem(FCM_DEVICE_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(FCM_DEVICE_ID_KEY, id);
    }
    return id;
  }

  function isFcmConfigured(): boolean {
    return getPublicFirebaseConfig() !== null;
  }

  async function registerFcmToken(options: FcmRegisterOptions = {}): Promise<string | null> {
    if (!import.meta.client) return null;

    const fbConfig = getPublicFirebaseConfig();
    if (!fbConfig) return null;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return null;
    if (Notification.permission === "denied") return null;

    const { getMessaging, getToken, isSupported } = await import("firebase/messaging");

    if (!(await isSupported())) return null;

    const app = await getFirebaseApp();
    if (!app) return null;
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;

    const messaging = getMessaging(app);
    attachForegroundMessageListener(messaging, siteUrl, siteName);

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;
    }

    const token = await getToken(messaging, {
      vapidKey: fbConfig.vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) return null;

    const deviceId = getOrCreateDeviceId();
    const cached = localStorage.getItem(FCM_TOKEN_CACHE_KEY);

    if (!options.force && cached === token) {
      return token;
    }

    await $fetch("/api/fcm/register", {
      method: "POST",
      body: {
        fcmToken: token,
        deviceId,
        locale: resolveCurrentLocale(),
        platform: "web",
        userAgent: navigator.userAgent,
        siteUrl,
        ...(options.userId ? { userId: options.userId } : {}),
        ...(options.email ? { email: options.email } : {}),
      },
    });

    localStorage.setItem(FCM_TOKEN_CACHE_KEY, token);
    return token;
  }

  return {
    getOrCreateDeviceId,
    isFcmConfigured,
    registerFcmToken,
  };
}
