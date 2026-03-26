<script setup lang="ts">
import { DialogFooter } from "@/components/ui/dialog";
import type { Tables } from "~/types/database.types";

type Category = Tables<"categories">;
type TransactionType = Category["type"];

const props = defineProps<{
  id?: string;
}>();

interface Form {
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const form = reactive<Form>({
  name: "",
  type: "expense",
  color: "",
  icon: "lucide:tag",
});

const colors = [
  { name: "red", bg: "bg-red-600", ring: "ring-red-500", border: "border-red-500" },
  { name: "yellow", bg: "bg-yellow-400", ring: "ring-yellow-400", border: "border-yellow-400" },
  { name: "green", bg: "bg-green-400", ring: "ring-green-500", border: "border-green-500" },
  { name: "cyan", bg: "bg-cyan-500", ring: "ring-cyan-500", border: "border-cyan-500" },
  { name: "blue", bg: "bg-blue-500", ring: "ring-blue-500", border: "border-blue-500" },
  { name: "purple", bg: "bg-purple-500", ring: "ring-purple-500", border: "border-purple-500" },
];

const typeOptions = [
  { label: "Receita", value: "income" },
  { label: "Despesa", value: "expense" },
];

const submit = () => {
  props.id ? update() : create();
};

const create = async () => {
  try {
    await $fetch("/api/categories", {
      method: "POST",
      body: form,
    });
    useToast({
      type: "success",
      title: "Sucesso!",
      description: "Categoria cadastrada com sucesso",
    });
    resetForm();
    emit("submit");
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description:
        error instanceof Error ? error.message : "Erro ao cadastrar categoria",
    });
  }
};

const update = async () => {
  try {
    await $fetch(`/api/categories/${props.id}`, {
      method: "PATCH",
      body: form,
    });
    useToast({
      type: "success",
      title: "Sucesso!",
      description: "Categoria atualizada com sucesso",
    });
    resetForm();
    emit("submit");
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description:
        error instanceof Error ? error.message : "Erro ao atualizar categoria",
    });
  }
};

const getData = async () => {
  try {
    const { category } = await $fetch<{ category: Category }>(
      `/api/categories/${props.id}`,
    );
    form.name = category.name;
    form.type = category.type;
    form.color = category.color ?? "";
    form.icon = category.icon || "lucide:tag";
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description:
        error instanceof Error ? error.message : "Erro ao buscar categoria",
    });
  }
};

const resetForm = () => {
  form.name = "";
  form.type = "expense";
  form.color = "";
  form.icon = "lucide:tag";
};
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <shared-input
      id="category_name"
      v-model="form.name"
      icon="lucide:folder-tree"
      label="Nome"
      placeholder="Ex.: Alimentação"
      required
    />
    <div class="space-y-2">
      <Label for="category_type">Tipo</Label>
      <shared-select
        id="category_type"
        v-model="form.type"
        placeholder="Tipo"
        :options="typeOptions"
      />
    </div>
    <shared-input
      id="category_icon"
      v-model="form.icon"
      icon="lucide:sparkles"
      label="Ícone (Iconify)"
      placeholder="lucide:shopping-cart"
    />
    <div class="max-w-xs space-y-2">
      <Label for="category_color">Cor (opcional)</Label>
      <div id="category_color" class="grid grid-cols-6 gap-2">
        <template v-for="color in colors" :key="color.name">
          <button
            type="button"
            :class="[
              'flex size-8 items-center justify-center rounded-full border transition focus:outline-none focus:ring-2',
              color.bg,
              form.color === color.name
                ? [color.ring, color.border, 'ring-2']
                : 'hover:border-primary',
            ]"
            :aria-label="`Selecionar cor ${color.name}`"
            @click="form.color = color.name"
          >
            <span v-if="form.color === color.name" class="text-white text-sm"
              >&#10003;</span
            >
          </button>
        </template>
      </div>
    </div>
    <DialogFooter class="grid gap-2 lg:grid-cols-2">
      <DialogClose as-child>
        <Button variant="outline">Cancelar</Button>
      </DialogClose>
      <Button type="submit">Salvar</Button>
    </DialogFooter>
  </form>
</template>
