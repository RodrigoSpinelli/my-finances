<script lang="ts" setup>
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>

<template>
  <NuxtLayout>
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