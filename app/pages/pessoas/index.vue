<script setup lang="ts">
import type { Tables } from "~/types/database.types";

type Person = Tables<"people">;

const { data, refresh, error, status } = await useFetch<{ people: Person[] }>(
  "/api/people",
);

const search = ref("");
const isOpen = ref(false);
const dialogId = ref<string | undefined>(undefined);

const openDialog = (id?: string) => {
  dialogId.value = id;
  isOpen.value = true;
};
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-8 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">Pessoas</h1>
      <p class="text-muted-foreground text-sm">
        Cadastre quem participa das finanças (você, família, etc.).
      </p>
    </header>

    <div class="flex items-center justify-between">
      <Input
        v-model="search"
        placeholder="Pesquisar pessoa"
        class="w-full max-w-xs"
        type="search"
      />
      <Button @click="openDialog()">Nova pessoa</Button>
    </div>

    <section class="space-y-4">
      <h2 class="text-lg font-medium">Lista</h2>

      <div v-if="status === 'pending'" class="text-muted-foreground text-sm">
        Carregando…
      </div>
      <div v-else-if="error" class="text-destructive text-sm">
        Não foi possível carregar as pessoas.
      </div>
      <div
        v-else-if="!data?.people?.length"
        class="text-muted-foreground text-sm"
      >
        Nenhuma pessoa ainda. Cadastre acima.
      </div>
      <div v-else class="overflow-x-auto rounded-xl border">
        <table class="w-full text-left text-sm">
          <thead class="bg-muted/50 border-b">
            <tr>
              <th class="px-4 py-3 font-medium">Nome</th>
              <th class="px-4 py-3 font-medium">Cor</th>
              <th class="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in data!.people"
              :key="p.id"
              class="border-b last:border-0"
            >
              <td class="px-4 py-3">{{ p.first_name }} {{ p.last_name }}</td>
              <td class="px-4 py-3">
                <span v-if="p.color" class="inline-flex items-center gap-2">
                  <span
                    class="text-muted-foreground max-w-48 font-mono text-xs"
                    >{{ p.color }}</span
                  >
                </span>
                <span v-else class="text-muted-foreground">—</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" @click="openDialog(p.id)">
                    Editar
                  </Button>
                  <Button type="button" variant="destructive" size="sm">
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <shared-dialog
      v-model="isOpen"
      title="Nova pessoa"
      form="person"
      :id="dialogId"
      @submit="refresh"
    />
  </div>
</template>
