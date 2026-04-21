<script setup>
import { defineAsyncComponent } from 'vue'

const Toaster = defineAsyncComponent(() =>
  import('vue3-hot-toast').then((m) => m.Toaster)
)
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
  </div>
</template>
