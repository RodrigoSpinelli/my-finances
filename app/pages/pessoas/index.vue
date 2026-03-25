<script setup lang="ts">
import type { Tables } from "~/types/database.types"
import {
  isPersonColorName,
  PERSON_COLOR_OPTIONS,
  personSwatchBgClass,
} from "#shared/person-colors"

type Person = Tables<"people">

const COLOR_NONE = "_none" as const

const colorSelectOptions = [
  {
    label: "Sem cor",
    value: COLOR_NONE,
    swatchClass: "bg-muted",
  },
  {
    label: "Azul",
    value: "blue",
    color: "blue",
  },
  {
    label: "Verde",
    value: "green",
    color: "green",
  },
  {
    label: "Vermelho",
    value: "red",
    color: "red",
  },
]

const { data, refresh, error, status } = await useFetch<{ people: Person[] }>(
  "/api/people",
)

const form = reactive<{
  first_name: string
  last_name: string
  color: string
}>({
  first_name: "",
  last_name: "",
  color: COLOR_NONE,
})

const editingId = ref<string | null>(null)
const saving = ref(false)
const deletingId = ref<string | null>(null)
const formError = ref("")

function resetForm() {
  editingId.value = null
  form.first_name = ""
  form.last_name = ""
  form.color = COLOR_NONE
}

function startEdit(p: Person) {
  editingId.value = p.id
  form.first_name = p.first_name
  form.last_name = p.last_name
  form.color =
    p.color && isPersonColorName(p.color) ? p.color : COLOR_NONE
}

function colorForApi(value: string): string | null {
  return value === COLOR_NONE ? null : value
}

async function submit() {
  formError.value = ""
  saving.value = true
  try {
    if (editingId.value) {
      await $fetch(`/api/people/${editingId.value}`, {
        method: "PATCH",
        body: {
          first_name: form.first_name,
          last_name: form.last_name,
          color: colorForApi(form.color),
        },
      })
    }
    else {
      await $fetch("/api/people", {
        method: "POST",
        body: {
          first_name: form.first_name,
          last_name: form.last_name,
          color: colorForApi(form.color),
        },
      })
    }
    await refresh()
    resetForm()
  }
  catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string }; message?: string }
    formError.value =
      err?.data?.statusMessage ?? err?.message ?? "Erro ao salvar"
  }
  finally {
    saving.value = false
  }
}

async function remove(id: string) {
  if (!confirm("Remover esta pessoa?")) return
  deletingId.value = id
  try {
    await $fetch(`/api/people/${id}`, { method: "DELETE" })
    await refresh()
    if (editingId.value === id) resetForm()
  }
  catch {
    formError.value = "Erro ao remover"
  }
  finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-8 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">
        Pessoas
      </h1>
      <p class="text-muted-foreground text-sm">
        Cadastre quem participa das finanças (você, família, etc.).
      </p>
    </header>

    <section
      class="bg-card text-card-foreground rounded-xl border p-6 shadow-sm"
    >
      <h2 class="mb-4 text-lg font-medium">
        {{ editingId ? "Editar pessoa" : "Nova pessoa" }}
      </h2>

      <form class="space-y-4" @submit.prevent="submit">
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="first_name">Nome</Label>
            <Input
              id="first_name"
              v-model="form.first_name"
              autocomplete="given-name"
              placeholder="Maria"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="last_name">Sobrenome</Label>
            <Input
              id="last_name"
              v-model="form.last_name"
              autocomplete="family-name"
              placeholder="Silva"
              required
            />
          </div>
        </div>
        <div class="max-w-xs space-y-2">
          <Label for="color">Cor (opcional)</Label>
          <div class="grid grid-cols-6">
            
          </div>
        </div>

        <p v-if="formError" class="text-destructive text-sm">
          {{ formError }}
        </p>

        <div class="flex flex-wrap gap-2">
          <Button type="submit" :disabled="saving">
            {{ saving ? "Salvando…" : editingId ? "Atualizar" : "Cadastrar" }}
          </Button>
          <Button
            v-if="editingId"
            type="button"
            variant="outline"
            :disabled="saving"
            @click="resetForm"
          >
            Cancelar edição
          </Button>
        </div>
      </form>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-medium">
        Lista
      </h2>

      <div
        v-if="status === 'pending'"
        class="text-muted-foreground text-sm"
      >
        Carregando…
      </div>
      <div
        v-else-if="error"
        class="text-destructive text-sm"
      >
        Não foi possível carregar as pessoas.
      </div>
      <div
        v-else-if="!data?.people?.length"
        class="text-muted-foreground text-sm"
      >
        Nenhuma pessoa ainda. Cadastre acima.
      </div>
      <div
        v-else
        class="overflow-x-auto rounded-xl border"
      >
        <table class="w-full text-left text-sm">
          <thead class="bg-muted/50 border-b">
            <tr>
              <th class="px-4 py-3 font-medium">
                Nome
              </th>
              <th class="px-4 py-3 font-medium">
                Cor
              </th>
              <th class="px-4 py-3 font-medium text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in data!.people"
              :key="p.id"
              class="border-b last:border-0"
            >
              <td class="px-4 py-3">
                {{ p.first_name }} {{ p.last_name }}
              </td>
              <td class="px-4 py-3">
                <span
                  v-if="p.color"
                  class="inline-flex items-center gap-2"
                >
                  <span
                    class="inline-block size-4 shrink-0 rounded-full border border-border/70"
                    :class="personSwatchBgClass(p.color)"
                    :title="p.color"
                  />
                  <span class="text-muted-foreground max-w-48 font-mono text-xs">{{
                    p.color
                  }}</span>
                </span>
                <span v-else class="text-muted-foreground">—</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    @click="startEdit(p)"
                  >
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    :disabled="deletingId === p.id"
                    @click="remove(p.id)"
                  >
                    {{ deletingId === p.id ? "…" : "Excluir" }}
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
