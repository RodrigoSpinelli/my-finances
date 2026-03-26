<script setup lang="ts"></script>

<template>
  <div
    class="bg-background text-foreground flex min-h-dvh flex-col items-center justify-center p-6"
  >
    <div class="absolute inset-e-4 top-4">
      <ClientOnly>
        <shared-toggle-color-mode aria-label="Alternar modo claro/escuro" />
      </ClientOnly>
    </div>
    <slot />
  </div>
</template>
