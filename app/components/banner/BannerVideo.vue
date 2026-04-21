<template>
  <div class="banner-video-intro w-full relative overflow-hidden">
    <video
      ref="videoRef"
      class="banner-video-intro__video"
      :class="{ 'banner-video-intro__video--hidden': showPoster }"
      :src="src"
      :poster="poster"
      autoplay
      muted
      loop
      playsinline
      webkit-playsinline
      preload="metadata"
      @loadeddata="handleReady"
      @canplay="handleReady"
      @playing="handleReady"
      @error="handleError"
    />
    <img
      v-if="showPoster"
      class="banner-video-intro__poster"
      :src="poster"
      alt=""
      decoding="async"
      loading="eager"
    >
    <div v-if="isVideoLoading && !poster" class="banner-video-intro__loading">
      <div class="w-full h-full skeleton" />
    </div>
    <div class="banner-video-intro__overlay" :class="overlayClass" />
    <div class="banner-video-intro__content w-full">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  src: {
    type: String,
    default: "/banner/video-fulfillment.mp4",
  },
  poster: {
    type: String,
    default: "",
  },
  overlayClass: {
    type: [String, Array, Object],
    default: "",
  },
});

const videoRef = ref(null);
let unbind = null;
const isVideoLoading = ref(!!props.src);
const isVideoReady = ref(false);
const showPoster = computed(() => !!props.poster && !isVideoReady.value);
let loadingTimeout = null;

const handleReady = () => {
  isVideoLoading.value = false;
  isVideoReady.value = true;
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
};

const handleError = () => {
  isVideoLoading.value = false;
  isVideoReady.value = false;
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
};

const tryPlay = async () => {
  const video = videoRef.value;
  if (!video) return;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  try {
    await video.play();
    handleReady();
  } catch {
    if (unbind) return;
    const onFirstGesture = async () => {
      try {
        await video.play();
        handleReady();
      } catch {
        handleError();
      } finally {
        if (unbind) unbind();
      }
    };
    window.addEventListener("touchstart", onFirstGesture, { passive: true });
    window.addEventListener("click", onFirstGesture, { passive: true });
    unbind = () => {
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("click", onFirstGesture);
      unbind = null;
    };
  }
};

onMounted(() => {
  if (typeof window === "undefined") return;
  isVideoReady.value = false;
  requestAnimationFrame(() => {
    tryPlay();
  });
  loadingTimeout = window.setTimeout(() => {
    isVideoLoading.value = false;
    isVideoReady.value = false;
    loadingTimeout = null;
  }, 3000);
});

onUnmounted(() => {
  if (unbind) unbind();
  if (loadingTimeout) {
    clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
});

watch(
  () => props.src,
  () => {
    isVideoLoading.value = !!props.src;
    isVideoReady.value = false;
    if (typeof window !== "undefined") {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      loadingTimeout = window.setTimeout(() => {
        isVideoLoading.value = false;
        isVideoReady.value = false;
        loadingTimeout = null;
      }, 3000);
      requestAnimationFrame(() => {
        tryPlay();
      });
    }
  }
);
</script>

<style lang="scss">
.banner-video-intro {
  background: #0d0d0d;
  min-height: 520px;
  height: calc(100vh - 77px);

  @media screen and (min-width: 768px) {
    min-height: 620px;
  }

  &__video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &__video--hidden {
    opacity: 0;
  }

  &__poster {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.75) 0%,
      rgba(0, 0, 0, 0.35) 55%,
      rgba(0, 0, 0, 0.75) 100%
    );
  }

  &__loading {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 0.2);
    backdrop-filter: blur(2px);
  }

  &__spinner {
    width: 44px;
    height: 44px;
    border-radius: 999px;
    border: 3px solid rgb(255 255 255 / 0.25);
    border-top-color: rgb(255 255 255 / 0.9);
    animation: banner-spin 0.9s linear infinite;
  }

  &__content {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px 15px 60px;

    @media screen and (min-width: 768px) {
      padding: 90px 15px 60px;
    }
  }
}

@keyframes banner-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
