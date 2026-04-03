<script setup lang="ts">
import { ArrowLeft, Loader2, LogIn } from "lucide-vue-next";
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
  <div class="w-full max-w-[420px]">
    <Card
      class="border-border/70 bg-card/85 gap-0 shadow-xl shadow-black/4 backdrop-blur-sm dark:shadow-black/25"
    >
      <CardHeader class="border-border/60 space-y-4 border-b pb-6 text-center">
        <div class="space-y-2">
          <CardTitle class="text-2xl font-semibold tracking-tight">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription class="text-base leading-relaxed">
            Entre com o e-mail e a senha da sua conta para acessar o painel.
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
          <shared-input
            v-model="password"
            label="Senha"
            type="password"
            icon="lucide:lock"
            autocomplete="current-password"
            placeholder="••••••••"
            required
          />
          <Button type="submit" class="mt-2 w-full gap-2" size="lg" :disabled="loading">
            <Loader2
              v-if="loading"
              class="size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
            {{ loading ? "Entrando…" : "Entrar" }}
          </Button>
        </form>
      </CardContent>
      <CardFooter
        class="border-border/60 flex flex-col gap-4 border-t py-6"
      >
        <p class="text-muted-foreground text-center text-sm">
          Ainda não tem conta?
          <NuxtLink
            to="/register"
            class="text-foreground font-semibold underline-offset-4 hover:underline"
          >
            Criar conta grátis
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
