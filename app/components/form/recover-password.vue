<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();
const { resolveSiteOrigin } = useSiteOrigin();

const email = ref("");
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
  const trimmed = email.value.trim();
  if (!trimmed) {
    useToast({
      type: "error",
      title: "E-mail obrigatório",
      description: "Informe o e-mail da sua conta.",
    });
    return;
  }

  loading.value = true;
  const origin = resolveSiteOrigin();
  const redirectTo = origin ? `${origin}/reset-password` : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
    ...(redirectTo ? { redirectTo } : {}),
  });
  loading.value = false;

  if (error) {
    useToast({
      type: "error",
      title: "Não foi possível enviar o e-mail",
      description: error.message,
    });
    return;
  }

  useToast({
    type: "success",
    title: "Verifique sua caixa de entrada",
    description:
      "Se existir uma conta com esse e-mail, enviamos um link para redefinir a senha.",
  });
  await navigateTo("/login");
}
</script>

<template>
  <form class="w-full min-w-0 space-y-4" @submit.prevent="onSubmit">
    <shared-input
      v-model="email"
      label="E-mail"
      type="email"
      autocomplete="email"
      icon="lucide:at-sign"
      placeholder="voce@exemplo.com"
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
      {{ loading ? "Enviando…" : "Enviar link" }}
    </Button>
  </form>
</template>
