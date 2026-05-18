/** Scroll-reveal directive — SSR-safe (noop on server, animates on client). */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("reveal", {
    getSSRProps() {
      return {};
    },
    mounted(el, binding) {
      const animationClass = binding.value || "animate__fadeInUp";

      el.style.visibility = "hidden";
      el.classList.add("animate__animated");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.style.visibility = "visible";
              el.classList.add(animationClass);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(el);
      (el as HTMLElement & { _observer?: IntersectionObserver })._observer = observer;
    },
    unmounted(el) {
      const target = el as HTMLElement & { _observer?: IntersectionObserver };
      target._observer?.disconnect();
    },
  });
});
