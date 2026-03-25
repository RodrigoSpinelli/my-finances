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
