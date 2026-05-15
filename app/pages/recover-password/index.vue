<script setup lang="ts">
import { ArrowLeft, KeyRound, Loader2 } from "lucide-vue-next";
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
  <div class="w-full max-w-[420px]">
    <Card
      class="border-border/70 bg-card/85 gap-0 shadow-xl shadow-black/4 backdrop-blur-sm dark:shadow-black/25"
    >
      <CardHeader class="border-border/60 space-y-4 border-b pb-6 text-center">
        <div
          class="bg-primary/12 text-primary ring-primary/10 mx-auto flex size-14 items-center justify-center rounded-2xl ring-1"
        >
          <KeyRound class="size-7" aria-hidden="true" />
        </div>
        <div class="space-y-2">
          <CardTitle class="text-2xl font-semibold tracking-tight">
            Recuperar senha
          </CardTitle>
          <CardDescription class="text-base leading-relaxed">
            Enviaremos um link seguro para o e-mail cadastrado. Abra-o para
            definir uma nova senha.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="py-4">
        <form class="space-y-4" @submit.prevent="onSubmit">
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
      </CardContent>
      <CardFooter
        class="border-border/60 flex flex-col gap-4 border-t py-6"
      >
        <p class="text-muted-foreground text-center text-sm">
          Lembrou da senha?
          <NuxtLink
            to="/login"
            class="text-foreground font-semibold underline-offset-4 hover:underline"
          >
            Voltar ao login
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
