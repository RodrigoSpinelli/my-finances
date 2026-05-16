<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";

import { Button } from "@/components/ui/button";

/** Desativa os botões enquanto o formulário com e-mail está em envio. */
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const oauthProvider = ref<"google" | "github" | null>(null);
const { signInWithOAuthProvider } = useSupabaseOAuth();

const busy = computed(() => oauthProvider.value !== null);

async function onOAuth(provider: "google" | "github") {
  if (!import.meta.client || props.disabled || busy.value) return;

  oauthProvider.value = provider;
  const { ok } = await signInWithOAuthProvider(provider);
  if (!ok) oauthProvider.value = null;
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <Button
      type="button"
      variant="outline"
      size="lg"
      class="w-full"
      :disabled="disabled || busy"
      aria-label="Continuar com Google"
      @click="onOAuth('google')"
    >
      <Loader2
        v-if="oauthProvider === 'google'"
        class="size-4 shrink-0 animate-spin"
        aria-hidden="true"
      />
      <Icon
        v-else
        name="simple-icons:google"
        class="size-4 shrink-0"
        aria-hidden="true"
      />
      {{ oauthProvider === "google" ? "Abrindo Google…" : "Continuar com Google" }}
    </Button>
    <Button
      type="button"
      variant="outline"
      size="lg"
      class="w-full"
      :disabled="disabled || busy"
      aria-label="Continuar com GitHub"
      @click="onOAuth('github')"
    >
      <Loader2
        v-if="oauthProvider === 'github'"
        class="size-4 shrink-0 animate-spin"
        aria-hidden="true"
      />
      <Icon
        v-else
        name="simple-icons:github"
        class="size-4 shrink-0"
        aria-hidden="true"
      />
      {{ oauthProvider === "github" ? "Abrindo GitHub…" : "Continuar com GitHub" }}
    </Button>
  </div>
</template>
