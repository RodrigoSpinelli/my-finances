<script setup lang="ts">
import type { Tables } from "~/types/database.types"
import { getFetchErrorMessage } from "~/utils/fetch-error"

useHead({
  title: "Perfil",
})

useSeoMeta({
  title: "Perfil",
  description: "Dados da conta e preferências.",
})

definePageMeta({
  name: "profile",
})

const user = useSupabaseUser()

const displayName = computed(() => {
  const meta = user.value?.user_metadata as { display_name?: string } | undefined
  const n = meta?.display_name?.trim()
  return n || "—"
})

const email = computed(() => user.value?.email ?? "—")

const { data, refresh, status, pending } = await useFetch<{
  preferences: Tables<"user_preferences"> | null
}>("/api/user-preferences")

type PreferredCurrency = Tables<"user_preferences">["preferred_currency"]

const currencyLabel = computed(() => {
  const cur = data.value?.preferences?.preferred_currency
  if (!cur)
    return "Nenhuma moeda salva no banco"
  const labels: Record<PreferredCurrency, string> = {
    BRL: "Real brasileiro (BRL)",
    EUR: "Euro (EUR)",
    USD: "Dólar americano (USD)",
  }
  return labels[cur]
})

const currencyOptions: { label: string; value: PreferredCurrency }[] = [
  { label: "Real brasileiro (BRL)", value: "BRL" },
  { label: "Euro (EUR)", value: "EUR" },
  { label: "Dólar americano (USD)", value: "USD" },
]

const currencyChoice = ref<PreferredCurrency>("BRL")

watch(
  () => data.value?.preferences?.preferred_currency,
  (c) => {
    if (c)
      currencyChoice.value = c
  },
  { immediate: true },
)

const savingCurrency = ref(false)

async function savePreferredCurrency() {
  savingCurrency.value = true
  try {
    await $fetch("/api/user-preferences", {
      method: "PATCH",
      body: { preferred_currency: currencyChoice.value },
    })
    await refresh()
    useToast({
      type: "success",
      title: "Preferência salva",
      description: "Sua moeda padrão foi atualizada.",
    })
  }
  catch (error) {
    useToast({
      type: "error",
      title: "Erro",
      description: getFetchErrorMessage(error, "Não foi possível salvar a moeda."),
    })
  }
  finally {
    savingCurrency.value = false
  }
}

function onChangePasswordPlaceholder() {
  useToast({
    type: "info",
    title: "Em breve",
    description: "A troca de senha ainda não está integrada.",
  })
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-8 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">
        Perfil
      </h1>
      <p class="text-muted-foreground text-sm">
        Dados da conta e preferências de exibição.
      </p>
    </header>

    <section
      class="border-border bg-card text-card-foreground space-y-6 rounded-lg border p-6 shadow-sm"
    >
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-lg font-medium">
          Conta
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          :disabled="pending"
          @click="refresh"
        >
          <Icon
            name="lucide:refresh-cw"
            class="size-4"
            :class="{ 'animate-spin': status === 'pending' }"
          />
          Atualizar preferências
        </Button>
      </div>

      <dl class="space-y-4 text-sm">
        <div class="space-y-1">
          <dt class="text-muted-foreground font-medium">
            Nome de exibição
          </dt>
          <dd class="text-foreground font-normal">
            {{ displayName }}
          </dd>
        </div>
        <div class="space-y-1">
          <dt class="text-muted-foreground font-medium">
            E-mail
          </dt>
          <dd class="text-foreground font-normal break-all">
            {{ email }}
          </dd>
        </div>
      </dl>

      <div class="border-border flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-muted-foreground text-xs">
          A troca de senha será conectada ao Supabase em outra etapa.
        </p>
        <Button type="button" variant="secondary" @click="onChangePasswordPlaceholder">
          <Icon name="lucide:key-round" class="size-4" />
          Trocar senha
        </Button>
      </div>
    </section>

    <section
      class="border-border bg-card text-card-foreground space-y-6 rounded-lg border p-6 shadow-sm"
    >
      <div class="space-y-1">
        <h2 class="text-lg font-medium">
          Moeda preferida
        </h2>
        <p class="text-muted-foreground text-sm">
          Usada para padronizar valores no app quando aplicável. Você pode
          alterar a qualquer momento.
        </p>
      </div>

      <div v-if="pending" class="text-muted-foreground text-sm">
        Carregando preferências…
      </div>
      <div v-else class="grid gap-4 sm:max-w-md">
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
        <p class="text-muted-foreground text-xs">
          Situação atual no banco:
          <span class="text-foreground font-medium">{{ currencyLabel }}</span>
        </p>
        <Button
          type="button"
          :disabled="savingCurrency"
          @click="savePreferredCurrency"
        >
          <Icon
            v-if="savingCurrency"
            name="lucide:loader-circle"
            class="size-4 animate-spin"
          />
          <Icon
            v-else
            name="lucide:save"
            class="size-4"
          />
          {{ savingCurrency ? "Salvando…" : "Salvar moeda" }}
        </Button>
      </div>
    </section>
  </div>
</template>
