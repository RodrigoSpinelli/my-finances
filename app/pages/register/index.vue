<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

const displayName = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
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
  if (password.value !== passwordConfirm.value) {
    useToast({
      type: "error",
      title: "Senhas não conferem",
      description: "Digite a mesma senha nos dois campos.",
    });
    return;
  }

  if (password.value.length < 6) {
    useToast({
      type: "error",
      title: "Senha curta demais",
      description: "Use pelo menos 6 caracteres.",
    });
    return;
  }

  const name = displayName.value.trim();
  if (!name) {
    useToast({
      type: "error",
      title: "Nome obrigatório",
      description: "Informe como quer ser chamado(a).",
    });
    return;
  }

  loading.value = true;
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/confirm`
      : undefined;

  const { data, error } = await supabase.auth.signUp({
    email: email.value.trim(),
    password: password.value,
    options: {
      ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
      data: {
        display_name: name,
      },
    },
  });
  loading.value = false;

  if (error) {
    useToast({
      type: "error",
      title: "Não foi possível criar a conta",
      description: error.message,
    });
    return;
  }

  if (data.session) {
    const path = redirectInfo.pluck();
    await navigateTo(path || "/dashboard");
    return;
  }

  useToast({
    type: "success",
    title: "Confirme seu e-mail",
    description:
      "Enviamos um link de confirmação. Abra-o para ativar a conta e entrar.",
  });
  await navigateTo("/login");
}
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
    <div class="space-y-1 text-center">
      <h1 class="text-2xl font-semibold tracking-tight">Criar conta</h1>
      <p class="text-muted-foreground text-sm">
        Cadastre-se com e-mail e senha. Se o projeto exigir confirmação por
        e-mail, você receberá um link para ativar a conta.
      </p>
    </div>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <shared-input
        v-model="displayName"
        label="Nome de exibição"
        type="text"
        autocomplete="name"
        placeholder="Como quer aparecer no app"
        required
      />
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
        autocomplete="new-password"
        placeholder="••••••••"
        minlength="6"
        required
      />
      <shared-input
        v-model="passwordConfirm"
        label="Confirmar senha"
        type="password"
        autocomplete="new-password"
        placeholder="••••••••"
        minlength="6"
        required
      />
      <Button type="submit" class="w-full" :disabled="loading">
        {{ loading ? "Criando conta…" : "Registrar" }}
      </Button>
    </form>

    <p class="text-muted-foreground text-center text-sm">
      Já tem conta?
      <NuxtLink
        to="/login"
        class="text-foreground font-medium underline-offset-4 hover:underline"
      >
        Entrar
      </NuxtLink>
    </p>
  </div>
</template>
