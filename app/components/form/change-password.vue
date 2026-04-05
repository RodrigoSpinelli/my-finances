<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { getFetchErrorMessage } from "~/utils/fetch-error";

interface Form {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const form = reactive<Form>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const loading = ref(false);

async function submit() {
  if (form.newPassword !== form.confirmPassword) {
    useToast({
      type: "error",
      title: "Senhas não conferem",
      description: "Digite a mesma senha nos dois campos da nova senha.",
    });
    return;
  }

  if (form.newPassword.length < 6) {
    useToast({
      type: "error",
      title: "Senha curta demais",
      description: "Use pelo menos 6 caracteres.",
    });
    return;
  }

  if (form.newPassword === form.currentPassword) {
    useToast({
      type: "error",
      title: "Senha repetida",
      description: "A nova senha precisa ser diferente da atual.",
    });
    return;
  }

  loading.value = true;
  try {
    await $fetch("/api/auth/change-password", {
      method: "POST",
      body: {
        current_password: form.currentPassword,
        new_password: form.newPassword,
      },
    });

    form.currentPassword = "";
    form.newPassword = "";
    form.confirmPassword = "";

    useToast({
      type: "success",
      title: "Senha alterada",
      description: "Sua nova senha já está valendo.",
    });
    emit("submit");
  } catch (error) {
    useToast({
      type: "error",
      title: "Não foi possível alterar a senha",
      description: getFetchErrorMessage(
        error,
        "Tente novamente em instantes.",
      ),
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <shared-input
      v-model="form.currentPassword"
      label="Senha atual"
      type="password"
      icon="lucide:lock"
      placeholder="Digite a senha atual"
      required
    />
    <shared-input
      v-model="form.newPassword"
      label="Nova senha"
      type="password"
      icon="lucide:lock"
      placeholder="Digite a nova senha"
      required
    />
    <shared-input
      v-model="form.confirmPassword"
      label="Confirmar senha"
      type="password"
      icon="lucide:lock"
      placeholder="Confirme a nova senha"
      required
    />
    <Button class="w-full gap-2" type="submit" :disabled="loading">
      <Loader2
        v-if="loading"
        class="size-4 shrink-0 animate-spin"
        aria-hidden="true"
      />
      {{ loading ? "Salvando…" : "Alterar senha" }}
    </Button>
  </form>
</template>
