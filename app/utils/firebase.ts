import type { FirebaseApp, FirebaseOptions } from "firebase/app";

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};

export type PublicFirebaseConfig = FirebaseClientConfig & {
  vapidKey: string;
};

export function getFirebaseClientConfig(): FirebaseClientConfig | null {
  const config = useRuntimeConfig();
  const apiKey = String(config.public.firebaseApiKey || "").trim();
  const projectId = String(config.public.firebaseProjectId || "").trim();
  const messagingSenderId = String(config.public.firebaseMessagingSenderId || "").trim();
  const appId = String(config.public.firebaseAppId || "").trim();

  if (!apiKey || !projectId || !messagingSenderId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain: String(config.public.firebaseAuthDomain || "").trim(),
    projectId,
    storageBucket: String(config.public.firebaseStorageBucket || "").trim(),
    messagingSenderId,
    appId,
    measurementId: String(config.public.firebaseMeasurementId || "").trim(),
  };
}

export function getPublicFirebaseConfig(): PublicFirebaseConfig | null {
  const base = getFirebaseClientConfig();
  const vapidKey = String(useRuntimeConfig().public.firebaseVapidKey || "").trim();
  if (!base || !vapidKey) return null;
  return { ...base, vapidKey };
}

export function toFirebaseOptions(cfg: FirebaseClientConfig): FirebaseOptions {
  return {
    apiKey: cfg.apiKey,
    authDomain: cfg.authDomain || undefined,
    projectId: cfg.projectId,
    storageBucket: cfg.storageBucket || undefined,
    messagingSenderId: cfg.messagingSenderId,
    appId: cfg.appId,
    measurementId: cfg.measurementId || undefined,
  };
}

export const FCM_DEVICE_ID_KEY = "pressify_fcm_device_id";
export const FCM_TOKEN_CACHE_KEY = "pressify_fcm_token";

export async function getFirebaseApp(): Promise<FirebaseApp | null> {
  const cfg = getFirebaseClientConfig();
  if (!cfg || !import.meta.client) return null;

  const { initializeApp, getApps } = await import("firebase/app");
  if (getApps().length) return getApps()[0]!;
  return initializeApp(toFirebaseOptions(cfg));
}

export async function initFirebaseAnalytics(): Promise<void> {
  const cfg = getFirebaseClientConfig();
  if (!cfg?.measurementId) return;

  const app = await getFirebaseApp();
  if (!app) return;

  const { getAnalytics, isSupported } = await import("firebase/analytics");
  if (!(await isSupported())) return;
  getAnalytics(app);
}
