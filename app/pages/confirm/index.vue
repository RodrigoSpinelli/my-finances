<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

definePageMeta({
  layout: "auth",
});

const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

watch(
  user,
  () => {
    if (user.value) {
      const path = redirectInfo.pluck();
      return navigateTo(path || "/dashboard");
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="w-full max-w-[440px]">
    <Card
      class="border-border/50 bg-card/75 gap-0 overflow-hidden rounded-2xl shadow-2xl shadow-black/8 ring-1 ring-border/40 backdrop-blur-xl dark:bg-card/70 dark:shadow-black/35"
    >
      <CardHeader class="border-border/50 space-y-5 border-b bg-muted/20 pb-8 pt-8 text-center dark:bg-muted/10">
        <div
          class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/15 dark:bg-violet-400/10 dark:ring-violet-400/20"
        >
          <shared-logo-icon icon-class="size-10 shrink-0" />
        </div>
        <div class="space-y-2">
          <CardTitle class="text-xl font-semibold tracking-tight">
            Confirmando sessão
          </CardTitle>
          <CardDescription class="text-base">
            Só um instante enquanto validamos seu acesso…
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent class="flex justify-center px-6 pb-10 pt-6 sm:px-8">
        <Loader2
          class="text-primary size-8 animate-spin"
          aria-label="Carregando"
        />
      </CardContent>
    </Card>
  </div>
</template>
