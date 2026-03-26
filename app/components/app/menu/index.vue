<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

async function signOut() {
  await supabase.auth.signOut();
  await navigateTo("/login");
}
</script>

<template>
  <nav
    class="bg-background/95 supports-backdrop-filter:bg-background/60 border-b backdrop-blur"
  >
    <div class="mx-auto flex max-w-4xl items-center gap-6 px-6 py-3">
      <div class="flex flex-1 items-center gap-6">
        <NuxtLink
          to="/"
          class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          active-class="text-primary"
        >
          Início
        </NuxtLink>
        <NuxtLink
          to="/people"
          class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          active-class="text-primary"
        >
          Pessoas
        </NuxtLink>
        <NuxtLink
          to="/categories"
          class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          active-class="text-primary"
        >
          Categorias
        </NuxtLink>
        <NuxtLink
          to="/transactions"
          class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          active-class="text-primary"
        >
          Transações
        </NuxtLink>
      </div>
      <div class="ml-auto flex items-center gap-3">
        <span
          v-if="user?.email"
          class="text-muted-foreground hidden max-w-48 truncate text-xs sm:inline"
          :title="user.email"
        >
          {{ user.email }}
        </span>
        <Button variant="ghost" size="sm" class="text-muted-foreground" @click="signOut">
          Sair
        </Button>
        <ClientOnly>
          <shared-toggle-color-mode aria-label="Alternar modo claro/escuro" />
        </ClientOnly>
      </div>
    </div>
  </nav>
</template>