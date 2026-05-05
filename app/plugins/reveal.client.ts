export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el, binding) {
      const animationClass = binding.value || 'animate__fadeInUp'
      
      // Initially hide the element if it's not in view
      el.style.visibility = 'hidden'
      el.classList.add('animate__animated')

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.style.visibility = 'visible'
              el.classList.add(animationClass)
              observer.unobserve(el)
            }
          })
        },
        {
          threshold: 0.1, // Trigger when 10% of the element is visible
        }
      )

      observer.observe(el)
      
      // Cleanup
      el._observer = observer
    },
    unmounted(el) {
      if (el._observer) {
        el._observer.disconnect()
      }
    }
  })
})
