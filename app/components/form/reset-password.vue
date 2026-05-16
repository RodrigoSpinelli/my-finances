<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const password = ref("");
const passwordConfirm = ref("");
const loading = ref(false);

/** Fluxo iniciado pelo link do e-mail (hash) ou evento do Supabase. */
const recoveryFlow = ref(false);

/** Após aguardar o cliente processar tokens da URL. */
const resolved = ref(false);

onBeforeMount(() => {
  if (import.meta.client && window.location.hash.includes("type=recovery")) {
    recoveryFlow.value = true;
  }
});

onMounted(() => {
  const { data: listenerData } = supabase.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      recoveryFlow.value = true;
    }
  });
  onUnmounted(() => {
    listenerData.subscription.unsubscribe();
  });

  void (async () => {
    for (let i = 0; i < 40; i++) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        break;
      }
      await new Promise((r) => setTimeout(r, 100));
    }
    resolved.value = true;
  })();
});

const showForm = computed(
  () => resolved.value && !!user.value && recoveryFlow.value,
);

const showLoggedInWithoutRecovery = computed(
  () => resolved.value && !!user.value && !recoveryFlow.value,
);

const showInvalidLink = computed(
  () => resolved.value && !user.value,
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

  loading.value = true;
  const { error } = await supabase.auth.updateUser({
    password: password.value,
  });
  loading.value = false;

  if (error) {
    useToast({
      type: "error",
      title: "Não foi possível alterar a senha",
      description: error.message,
    });
    return;
  }

  useToast({
    type: "success",
    title: "Senha atualizada",
    description: "Você já pode usar a nova senha.",
  });
  await navigateTo("/dashboard");
}
</script>

<template>
  <div class="w-full min-w-0">
    <div
      v-if="!resolved"
      class="flex flex-col items-center justify-center gap-3 px-1 py-8 sm:py-10"
    >
      <Loader2
        class="text-primary size-8 animate-spin"
        aria-label="Carregando"
      />
      <p class="text-muted-foreground text-center text-sm">Validando o link…</p>
    </div>

    <div v-else-if="showLoggedInWithoutRecovery" class="space-y-4 py-2">
      <p class="text-muted-foreground text-balance text-center text-sm leading-relaxed sm:text-base">
        Este endereço é só para links enviados por e-mail. Para alterar a senha
        com a conta aberta, use o perfil.
      </p>
      <Button class="w-full" size="lg" as-child>
        <NuxtLink to="/profile"> Ir ao perfil </NuxtLink>
      </Button>
    </div>

    <div v-else-if="showInvalidLink" class="space-y-4 py-2">
      <p class="text-muted-foreground text-balance text-center text-sm leading-relaxed sm:text-base">
        O link é inválido ou expirou. Solicite um novo e-mail de recuperação.
      </p>
      <Button class="w-full" size="lg" as-child>
        <NuxtLink to="/recover-password"> Pedir novo link </NuxtLink>
      </Button>
    </div>

    <form v-else-if="showForm" class="w-full min-w-0 space-y-4" @submit.prevent="onSubmit">
      <shared-input
        v-model="password"
        label="Nova senha"
        type="password"
        icon="lucide:lock"
        autocomplete="new-password"
        placeholder="Mínimo 6 caracteres"
        minlength="6"
        required
      />
      <shared-input
        v-model="passwordConfirm"
        label="Confirmar senha"
        type="password"
        icon="lucide:lock"
        autocomplete="new-password"
        placeholder="Repita a senha"
        minlength="6"
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
        {{ loading ? "Salvando…" : "Salvar nova senha" }}
      </Button>
    </form>
  </div>
</template>
