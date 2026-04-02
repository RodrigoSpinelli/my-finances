<script setup lang="ts">
import { PiggyBankIcon } from "lucide-vue-next";
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const displayLabel = computed(() => {
  const meta = user.value?.user_metadata as
    | { display_name?: string }
    | undefined;
  const n = meta?.display_name?.trim();
  return n || user.value?.email || "";
});

async function signOut() {
  await supabase.auth.signOut();
  await navigateTo("/login");
}
</script>

<template>
  <nav
    class="bg-background/95 supports-backdrop-filter:bg-background/60 border-b backdrop-blur fixed top-0 left-0 right-0 z-50"
  >
    <div class="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
      <PiggyBankIcon class="w-5 h-5" />
      <div class="flex flex-1 items-center gap-6">
        <!-- Adiciona o ícone do PiggyBank no início do menu -->

        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          active-class="text-primary"
        >
          Início
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
        <NuxtLink
          to="/profile"
          class="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          active-class="text-primary"
        >
          Perfil
        </NuxtLink>
      </div>
      <div class="ml-auto flex items-center gap-3">
        <span
          v-if="displayLabel"
          class="text-muted-foreground hidden max-w-48 truncate text-xs sm:inline"
          :title="displayLabel"
        >
          {{ displayLabel }}
        </span>
        <Button
          variant="ghost"
          size="sm"
          class="text-muted-foreground"
          @click="signOut"
        >
          Sair
        </Button>
        <ClientOnly>
          <shared-toggle-color-mode aria-label="Alternar modo claro/escuro" />
        </ClientOnly>
      </div>
    </div>
  </nav>
</template>
