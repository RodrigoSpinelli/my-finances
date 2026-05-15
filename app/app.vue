<script lang="ts" setup>
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

/** Same palette as `shared/logo-icon` (violet-500 → purple-500 → fuchsia-500), ~opacity-95 */
const loadingIndicatorColor =
  "linear-gradient(to right, rgba(139, 92, 246, 0.95) 0%, rgba(168, 85, 247, 0.95) 50%, rgba(217, 70, 239, 0.95) 100%)";
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator :height="4" :color="loadingIndicatorColor" />
    <Toaster position="top-right" :duration="3000" rich-colors expand />
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>