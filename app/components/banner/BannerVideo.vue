<template>
  <div class="banner-video-intro w-full relative overflow-hidden">
    <video
      ref="videoRef"
      class="banner-video-intro__video"
      :src="src"
      :poster="poster"
      autoplay
      muted
      loop
      playsinline
      webkit-playsinline
      preload="metadata"
    />
    <div class="banner-video-intro__overlay" :class="overlayClass" />
    <div class="banner-video-intro__content w-full">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

defineProps({
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

const tryPlay = async () => {
  const video = videoRef.value;
  if (!video) return;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  try {
    await video.play();
  } catch {
    if (unbind) return;
    const onFirstGesture = async () => {
      try {
        await video.play();
      } catch (error) {
        console.error('Failed to play video on first gesture', error);
      }
      if (unbind) unbind();
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
  requestAnimationFrame(() => {
    tryPlay();
  });
});

onUnmounted(() => {
  if (unbind) unbind();
});
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
</style>
