<script setup lang="ts"></script>

<template>
  <nav
    class="bg-background/95 supports-backdrop-filter:bg-background/60 border-b backdrop-blur"
  >
    <div class="mx-auto flex max-w-4xl items-center gap-6 px-6 py-3">
      <NuxtLink
        to="/"
        class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        active-class="text-foreground"
      >
        Início
      </NuxtLink>
      <NuxtLink
        to="/people"
        class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        active-class="text-foreground"
      >
        Pessoas
      </NuxtLink>
    </div>
  </nav>
</template>