<script setup lang="ts">
import type { Tables } from "~/types/database.types";
import { getFetchErrorMessage } from "~/utils/fetch-error";

useHead({
  title: "Perfil",
});

useSeoMeta({
  title: "Perfil",
  description: "Dados da conta e preferências.",
});

definePageMeta({
  name: "profile",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { preferences, pending } = storeToRefs(useUserStore());
const { getPreferences } = useUserStore();

const displayNameInput = ref("");

watch(
  user,
  (u) => {
    const meta = u?.user_metadata as { display_name?: string } | undefined;
    displayNameInput.value = meta?.display_name?.trim() ?? "";
  },
  { immediate: true },
);

const savedDisplayTrimmed = computed(() => {
  const meta = user.value?.user_metadata as { display_name?: string } | undefined;
  return meta?.display_name?.trim() ?? "";
});

const displayNameDirty = computed(
  () => displayNameInput.value.trim() !== savedDisplayTrimmed.value,
);

const editingDisplayName = ref(false);
const savingDisplayName = ref(false);

function startEditDisplayName() {
  displayNameInput.value = savedDisplayTrimmed.value;
  editingDisplayName.value = true;
}

function cancelEditDisplayName() {
  displayNameInput.value = savedDisplayTrimmed.value;
  editingDisplayName.value = false;
}

async function saveDisplayName() {
  const trimmed = displayNameInput.value.trim();
  if (!trimmed) {
    useToast({
      type: "error",
      title: "Nome obrigatório",
      description: "Informe como quer ser chamado(a).",
    });
    return;
  }

  savingDisplayName.value = true;
  const { error } = await supabase.auth.updateUser({
    data: { display_name: trimmed },
  });
  savingDisplayName.value = false;

  if (error) {
    useToast({
      type: "error",
      title: "Não foi possível salvar",
      description: error.message,
    });
    return;
  }

  await supabase.auth.refreshSession();

  editingDisplayName.value = false;

  useToast({
    type: "success",
    title: "Nome atualizado",
    description: "Seu nome de exibição foi salvo.",
  });
}

const email = computed(() => user.value?.email ?? "—");

type PreferredCurrency = Tables<"user_preferences">["preferred_currency"];

const currencyOptions: { label: string; value: PreferredCurrency }[] = [
  { label: "Real brasileiro (BRL)", value: "BRL" },
  { label: "Euro (EUR)", value: "EUR" },
  { label: "Dólar americano (USD)", value: "USD" },
];

const currencyChoice = ref<PreferredCurrency>("BRL");

watch(
  () => preferences.value?.preferred_currency,
  (c) => {
    if (c) currencyChoice.value = c;
  },
  { immediate: true },
);

const savingCurrency = ref(false);

async function savePreferredCurrency() {
  savingCurrency.value = true;
  try {
    await $fetch("/api/user-preferences", {
      method: "PATCH",
      body: { preferred_currency: currencyChoice.value },
    });
    await getPreferences();
    useToast({
      type: "success",
      title: "Preferência salva",
      description: "Sua moeda padrão foi atualizada.",
    });
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro",
      description: getFetchErrorMessage(
        error,
        "Não foi possível salvar a moeda.",
      ),
    });
  } finally {
    savingCurrency.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-8 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">Perfil</h1>
      <p class="text-muted-foreground text-sm">
        Dados da conta e preferências de exibição.
      </p>
    </header>

    <section
      class="border-border bg-card text-card-foreground flex flex-col gap-6 rounded-lg border p-6 shadow-sm"
    >
      <div
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <h2 class="text-lg font-medium">Conta</h2>
        <div class="flex flex-wrap items-center gap-2">
          <Button
            v-if="!editingDisplayName"
            type="button"
            variant="secondary"
            @click="startEditDisplayName"
          >
            <Icon name="lucide:pencil-line" class="size-4" />
            Editar
          </Button>
          <shared-dialog
            form="changePassword"
            title="Alterar senha"
            description="Alterar a senha da conta"
          >
            <template #trigger>
              <Button type="button" variant="secondary">
                <Icon name="lucide:key-round" class="size-4" />
                Trocar senha
              </Button>
            </template>
          </shared-dialog>
        </div>
      </div>

      <div class="grow space-y-6 text-sm">
        <div v-if="!editingDisplayName" class="space-y-1">
          <p class="text-muted-foreground font-medium">Nome de exibição</p>
          <p class="text-foreground">
            {{ savedDisplayTrimmed || "—" }}
          </p>
        </div>
        <shared-input
          v-else
          id="profile_display_name"
          v-model="displayNameInput"
          label="Nome de exibição"
          type="text"
          autocomplete="name"
          icon="lucide:user"
          placeholder="Como deseja ser chamado(a)?"
          maxlength="120"
          :disabled="savingDisplayName"
        />
        <dl class="space-y-1">
          <dt class="text-muted-foreground font-medium">E-mail</dt>
          <dd class="text-foreground font-normal break-all">
            {{ email }}
          </dd>
        </dl>
      </div>

      <div
        v-if="editingDisplayName"
        class="border-border flex flex-wrap items-center justify-end gap-2 border-t pt-6"
      >
        <Button
          type="button"
          variant="outline"
          :disabled="savingDisplayName"
          @click="cancelEditDisplayName"
        >
          <Icon name="lucide:x" class="size-4" />
          Cancelar
        </Button>
        <Button
          type="button"
          :disabled="
            savingDisplayName ||
            !displayNameDirty ||
            !displayNameInput.trim()
          "
          @click="saveDisplayName"
        >
          <Icon
            v-if="savingDisplayName"
            name="lucide:loader-circle"
            class="size-4 animate-spin"
          />
          <Icon v-else name="lucide:save" class="size-4" />
          {{ savingDisplayName ? "Salvando…" : "Salvar" }}
        </Button>
      </div>
    </section>

    <section
      class="border-border bg-card text-card-foreground space-y-6 rounded-lg border p-6 shadow-sm"
    >
      <div class="space-y-1">
        <h2 class="text-lg font-medium">Moeda preferida</h2>
        <p class="text-muted-foreground text-sm">
          Usada para padronizar valores no app quando aplicável. Você pode
          alterar a qualquer momento.
        </p>
      </div>

      <div v-if="pending" class="text-muted-foreground text-sm">
        Carregando preferências…
      </div>
      <div v-else class="grid gap-4">
        <div class="space-y-2">
          <Label for="pref_currency">Moeda</Label>
          <shared-select
            id="pref_currency"
            v-model="currencyChoice"
            placeholder="Selecione a moeda"
            :options="currencyOptions"
            :disabled="savingCurrency"
          />
        </div>
        <Button
          type="button"
          :disabled="
            savingCurrency || currencyChoice === preferences?.preferred_currency
          "
          @click="savePreferredCurrency"
        >
          <Icon
            v-if="savingCurrency"
            name="lucide:loader-circle"
            class="size-4 animate-spin"
          />
          <Icon v-else name="lucide:save" class="size-4" />
          {{ savingCurrency ? "Salvando…" : "Salvar moeda" }}
        </Button>
      </div>
    </section>
  </div>
</template>
