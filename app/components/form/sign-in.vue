<script setup lang="ts">
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
  <form class="space-y-4 w-full" @submit.prevent="onSubmit">
    <shared-input
      v-model="email"
      label="E-mail"
      type="email"
      autocomplete="email"
      icon="lucide:at-sign"
      placeholder="voce@exemplo.com"
      required
    />
    <shared-input
      v-model="password"
      label="Senha"
      type="password"
      icon="lucide:lock"
      autocomplete="current-password"
      placeholder="••••••••"
      required
    />
    <Button
      type="submit"
      class="mt-2 w-full gap-2"
      size="lg"
      :disabled="loading"
    >
      <Loader2
        v-if="loading"
        class="size-4 shrink-0 animate-spin"
        aria-hidden="true"
      />
      <Icon name="lucide:log-in" class="size-4 shrink-0" aria-hidden="true" />
      <span>{{ loading ? "Entrando…" : "Entrar" }}</span>
    </Button>
  </form>
</template>
