<script setup lang="ts">
import { ArrowLeft, Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

definePageMeta({
  layout: "auth",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();
const { resolveSiteOrigin } = useSiteOrigin();

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
  const origin = resolveSiteOrigin();
  const redirectTo = origin ? `${origin}/confirm` : undefined;

  const { data, error } = await supabase.auth.signUp({
    email: email.value.trim(),
    password: password.value,
    options: {
      ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
      data: { display_name: name },
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
  <div class="w-full max-w-[440px]">
    <Card
      class="border-border/50 bg-card/75 gap-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/8 ring-1 ring-border/40 backdrop-blur-xl dark:bg-card/70 dark:shadow-black/35"
    >
      <CardHeader class="border-border/50 space-y-5 border-b bg-muted/20 pb-7 pt-8 text-center dark:bg-muted/10">
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/15 dark:bg-violet-400/10 dark:ring-violet-400/20"
        >
          <shared-logo-icon icon-class="size-10 shrink-0" />
        </div>
        <div class="space-y-2">
          <CardTitle class="text-2xl font-semibold tracking-tight">
            Crie sua conta
          </CardTitle>
          <CardDescription class="text-base leading-relaxed">
            Falta pouco para você começar a organizar suas finanças.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="max-h-[min(60vh,520px)] overflow-y-auto px-6 py-6 sm:px-8">
        <form class="space-y-4" @submit.prevent="onSubmit">
          <shared-input
            v-model="displayName"
            label="Nome de exibição"
            type="text"
            autocomplete="name"
            icon="lucide:user"
            placeholder="Como deseja ser chamado(a)?"
            required
          />
          <shared-input
            v-model="email"
            label="E-mail"
            type="email"
            icon="lucide:at-sign"
            autocomplete="email"
            placeholder="voce@exemplo.com"
            required
          />
          <shared-input
            v-model="password"
            label="Senha"
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
            {{ loading ? "Criando conta…" : "Criar conta" }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="border-border/50 bg-muted/10 flex flex-col gap-4 border-t px-6 py-6 sm:px-8 dark:bg-muted/5">
        <p class="text-muted-foreground text-center text-sm">
          Já tem conta?
          <NuxtLink
            to="/login"
            class="text-foreground font-semibold underline-offset-4 hover:underline"
          >
            Entrar
          </NuxtLink>
        </p>
        <NuxtLink
          to="/"
          class="text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft class="size-4 shrink-0" aria-hidden="true" />
          Voltar ao início
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>
