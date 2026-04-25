<script setup>
import { defineAsyncComponent, onMounted } from 'vue'

const Toaster = defineAsyncComponent(() =>
  import('vue3-hot-toast').then((m) => m.Toaster)
)

onMounted(() => {
  if (typeof window === 'undefined') return
  if (window.LiveChatWidget) return

  window.__lc = window.__lc || {}
  window.__lc.license = 19667034
  window.__lc.integration_name = 'manual_channels'
  window.__lc.product_name = 'Pressify'

  ;(function (n, t) {
    function i(n) {
      return e._h ? e._h.apply(null, n) : e._q.push(n)
    }
    const e = {
      _q: [],
      _h: null,
      _v: '2.0',
      on(...args) {
        i(['on', args])
      },
      once(...args) {
        i(['once', args])
      },
      off(...args) {
        i(['off', args])
      },
      get(...args) {
        if (!e._h) throw new Error("[Pressify LiveChatWidget] You can't use getters before load.")
        return i(['get', args])
      },
      call(...args) {
        i(['call', args])
      },
      init() {
        const s = t.createElement('script')
        s.async = true
        s.type = 'text/javascript'
        s.src = 'https://cdn.livechatinc.com/tracking.js'
        t.head.appendChild(s)
      }
    }

    if (!n.__lc.asyncInit) e.init()
    n.LiveChatWidget = n.LiveChatWidget || e
  })(window, document)
})
</script>
<template>
  <div data-theme="root" class="app h-screen w-full">
    <ClientOnly>
      <Toaster
        position="top-right"
        :reverse-order="true"
        :toast-options="{
          duration: 5000
        }"
      />
    </ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <noscript>
      <a href="https://www.livechat.com/chat-with/19667034/" rel="nofollow">Chat with us</a>, powered by
      <a href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">LiveChat</a>
    </noscript>
  </div>
</template>
