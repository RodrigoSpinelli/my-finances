<script setup lang="ts">
import { TableCell, TableRow } from "@/components/ui/table";
import type { Tables } from "~/types/database.types";
import type { TableHeaders } from "~/interfaces/table";

useHead({
  title: "Pessoas",
});

useSeoMeta({
  title: "Pessoas",
  description: "Cadastre quem participa das finanças (você, família, etc.).",
});

definePageMeta({
  layout: "default",
  name: "people",
});

type Person = Tables<"people">;

const { data, refresh, error, status, pending } = await useFetch<{
  people: Person[];
}>("/api/people");

const headers: TableHeaders[] = [
  { label: "Nome" },
  { label: "Cor" },
  { label: "Ações", align: "right" },
];

const search = ref("");
const isOpen = ref(false);
const dialogId = ref<string | undefined>(undefined);

const people = computed(() => data.value?.people ?? []);

const filteredPeople = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return people.value;
  return people.value.filter((p) => {
    const full = `${p.first_name} ${p.last_name}`.toLowerCase();
    return full.includes(q) || (p.color ?? "").toLowerCase().includes(q);
  });
});

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
      <shared-input
        v-model="search"
        placeholder="Pesquisar pelo nome"
        type="search"
        icon="lucide:search"
        class="w-full max-w-xs"
      />
      <div class="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" @click="refresh">
          <Icon
            name="lucide:refresh-cw"
            :class="{ 'animate-spin': status === 'pending' }"
          />
          {{ status === "pending" ? "Carregando..." : "Atualizar" }}
        </Button>
        <Button type="button" variant="default" size="sm" @click="openDialog()">
          <Icon name="lucide:plus" />
          Nova pessoa
        </Button>
      </div>
    </div>

    <section class="space-y-4">
      <h2 class="text-lg font-medium">Lista</h2>

      <shared-table :headers="headers" :is-loading="pending">
        <TableRow v-for="p in filteredPeople" :key="p.id">
          <TableCell>{{ p.first_name }} {{ p.last_name }}</TableCell>
          <TableCell>
            <shared-person-color-swatch :color="p.color" />
          </TableCell>
          <TableCell class="text-right">
            <div class="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="openDialog(p.id)"
              >
                <Icon name="lucide:edit" />
              </Button>
              <Button type="button" variant="destructive" size="sm">
                <Icon name="lucide:trash" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </shared-table>
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
