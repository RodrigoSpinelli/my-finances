<script setup lang="ts"></script>

<template>
  <div class="mx-auto max-w-4xl space-y-4 p-6">
    <h1 class="text-2xl font-semibold tracking-tight">
      Minhas finanças
    </h1>
    <p class="text-muted-foreground text-sm">
      Use o menu para gerenciar
      <NuxtLink
        to="/categories"
        class="text-foreground underline-offset-4 hover:underline"
      >
        categorias
      </NuxtLink>
      e
      <NuxtLink
        to="/transactions"
        class="text-foreground underline-offset-4 hover:underline"
      >
        transações
      </NuxtLink>
      ou abra o
      <NuxtLink
        to="/profile"
        class="text-foreground underline-offset-4 hover:underline"
      >
        perfil
      </NuxtLink>
      .
    </p>
  </div>
</template>