/** Firebase app + Analytics (matches Firebase console web setup). */
export default defineNuxtPlugin(() => {
  if (!getFirebaseClientConfig()) return;

  onNuxtReady(() => {
    void initFirebaseAnalytics().catch(() => {
      /* analytics blocked or unsupported */
    });
  });
});
