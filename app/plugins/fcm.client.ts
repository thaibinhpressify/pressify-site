export default defineNuxtPlugin(() => {
  const { isFcmConfigured, registerFcmToken } = useFcm();

  if (!isFcmConfigured()) return;

  onNuxtReady(() => {
    window.setTimeout(() => {
      void registerFcmToken().catch(() => {
        /* permission denied or browser unsupported */
      });
    }, 2500);
  });
});
