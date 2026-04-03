<script setup lang="ts">
import { Loader2, PiggyBankIcon } from "lucide-vue-next";
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
  <div class="w-full max-w-[420px]">
    <Card
      class="border-border/70 bg-card/85 gap-0 shadow-xl shadow-black/4 backdrop-blur-sm dark:shadow-black/25"
    >
      <CardHeader class="space-y-4 border-0 pb-0 text-center">
        <div
          class="bg-primary/12 text-primary ring-primary/10 mx-auto flex size-14 items-center justify-center rounded-2xl ring-1"
        >
          <PiggyBankIcon class="size-7" aria-hidden="true" />
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
      <CardContent class="flex justify-center pb-8 pt-4">
        <Loader2
          class="text-primary size-8 animate-spin"
          aria-label="Carregando"
        />
      </CardContent>
    </Card>
  </div>
</template>
