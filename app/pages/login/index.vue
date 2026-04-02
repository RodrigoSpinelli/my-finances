<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

const email = ref("");
const password = ref("");
const loading = ref(false);

watch(
  user,
  async (u) => {
    if (u) {
      const path = redirectInfo.pluck();
      await navigateTo(path || "/dashboard");
    }
  },
  { immediate: true },
);

async function onSubmit() {
  loading.value = true;
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value,
  });
  loading.value = false;

  if (error) {
    useToast({
      type: "error",
      title: "Não foi possível entrar",
      description: error.message,
    });
    return;
  }

  const path = redirectInfo.pluck();
  await navigateTo(path || "/dashboard");
}
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
    <div class="space-y-1 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">Entrar</h1>
      <p class="text-muted-foreground text-sm">
        Use o e-mail e a senha da sua conta Supabase.
      </p>
    </div>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <shared-input
        v-model="email"
        label="E-mail"
        type="email"
        autocomplete="email"
        placeholder="voce@exemplo.com"
        required
      />
      <shared-input
        v-model="password"
        label="Senha"
        type="password"
        autocomplete="current-password"
        placeholder="••••••••"
        required
      />
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? "Entrando…" : "Entrar" }}
      </Button>
    </form>

    <p class="text-muted-foreground text-center text-sm">
      Não tem conta?
      <NuxtLink
        to="/register"
        class="text-foreground font-medium underline-offset-4 hover:underline"
      >
        Registrar
      </NuxtLink>
    </p>
  </div>
</template>
