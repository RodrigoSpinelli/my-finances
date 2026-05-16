<script setup lang="ts">
import type { Component } from "vue";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-vue-next";

type AuthVariant = "sign-in" | "sign-up" | "recover-password" | "reset-password";

type AuthSectionsVisibility = {
  oauthDivider: boolean;
  signUpPrompt: boolean;
  recoverPasswordPrompt: boolean;
  backToLogin: boolean;
};

const authSectionsVisibility = {
  "sign-in": {
    oauthDivider: true,
    signUpPrompt: true,
    recoverPasswordPrompt: true,
    backToLogin: false,
  },
  "sign-up": {
    oauthDivider: true,
    signUpPrompt: false,
    recoverPasswordPrompt: false,
    backToLogin: true,
  },
  "recover-password": {
    oauthDivider: false,
    signUpPrompt: false,
    recoverPasswordPrompt: false,
    backToLogin: true,
  },
  "reset-password": {
    oauthDivider: false,
    signUpPrompt: false,
    recoverPasswordPrompt: false,
    backToLogin: true,
  },
} satisfies Record<AuthVariant, AuthSectionsVisibility>;

const props = withDefaults(
  defineProps<{
    variant: AuthVariant;
  }>(),
  { variant: "sign-in" },
);

const sections = computed(() => authSectionsVisibility[props.variant]);

const title = {
  "sign-in": "Entrar na sua conta",
  "sign-up": "Criar conta",
  "recover-password": "Recuperar senha",
  "reset-password": "Redefinir senha",
} satisfies Record<AuthVariant, string>;

const description = {
  "sign-in": "Faça login para continuar e começar a usar o sistema.",
  "sign-up": "Crie uma conta para continuar e começar a usar o sistema.",
  "recover-password": "Digite o e-mail da sua conta para receber um link de recuperação.",
  "reset-password": "Digite a nova senha para sua conta.",
} satisfies Record<AuthVariant, string>;

const form = {
  "sign-in": defineAsyncComponent(() => import("@/components/form/sign-in.vue")),
  "sign-up": defineAsyncComponent(() => import("@/components/form/sign-up.vue")),
  "recover-password": defineAsyncComponent(() => import("@/components/form/recover-password.vue")),
  "reset-password": defineAsyncComponent(() => import("@/components/form/reset-password.vue")),
} satisfies Record<AuthVariant, Component>;
</script>

<template>
  <div class="flex w-full min-w-0 max-w-md flex-col space-y-4">
    <div class="min-w-0">
      <shared-logo-icon icon-class="size-9 shrink-0 sm:size-10" />
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">
        {{ title[variant] }}
      </h1>
      <p class="text-muted-foreground mb-4 mt-2 text-sm leading-relaxed sm:text-base">
        {{ description[variant] }}
      </p>
    </div>
    <component :is="form[variant]" :key="variant" />
    <template v-if="sections.oauthDivider">
      <Separator class="my-4" />
      <div class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <Button variant="outline" class="h-auto min-h-11 w-full gap-2 py-2.5">
          <Icon name="simple-icons:google" class="size-4 shrink-0" />
          <span class="text-center leading-snug">Continuar com Google</span>
        </Button>
        <Button variant="outline" class="h-auto min-h-11 w-full gap-2 py-2.5">
          <Icon name="simple-icons:github" class="size-4 shrink-0" />
          <span class="text-center leading-snug">Continuar com GitHub</span>
        </Button>
      </div>
    </template>
    <p
      v-if="sections.signUpPrompt"
      class="text-sm text-muted-foreground text-center"
    >
      Não tem uma conta?
      <NuxtLink
        to="/register"
        class="text-primary font-semibold underline-offset-4 hover:underline"
      >
        Criar conta
      </NuxtLink>
    </p>
    <p
      v-if="sections.recoverPasswordPrompt"
      class="text-sm text-muted-foreground text-center"
    >
      Esqueceu sua senha?
      <NuxtLink
        to="/recover-password"
        class="text-primary font-semibold underline-offset-4 hover:underline"
      >
        Recuperar senha
      </NuxtLink>
    </p>
    <NuxtLink
      v-if="sections.backToLogin"
      to="/login"
      class="text-muted-foreground hover:text-foreground -mx-1 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-1 text-sm font-medium transition-colors touch-manipulation sm:mx-0 sm:w-auto sm:justify-start"
    >
      <ArrowLeft class="size-4 shrink-0" aria-hidden="true" />
      Voltar ao início
    </NuxtLink>
  </div>
</template>
