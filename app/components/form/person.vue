<script setup lang="ts">
import { DialogFooter } from "@/components/ui/dialog";
import { PERSON_COLORS } from "~/constants/person-colors";
import type { Tables } from "~/types/database.types";

type Person = Tables<"people">;

const props = defineProps<{
  id?: string;
}>();

interface Form {
  first_name: string;
  last_name: string;
  color: string;
}

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const form = reactive<Form>({
  first_name: "",
  last_name: "",
  color: "",
});

const colors = PERSON_COLORS;

const submit = () => {
  props.id ? update() : create();
};

const create = async () => {
  try {
    await $fetch("/api/people", {
      method: "POST",
      body: form,
    });
    useToast({
      type: "success",
      title: "Sucesso!",
      description: "Pessoa cadastrada com sucesso",
    });
    resetForm();
    emit("submit");
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description:
        error instanceof Error ? error.message : "Erro ao cadastrar pessoa",
    });
  }
};

const update = async () => {
  try {
    await $fetch(`/api/people/${props.id}`, {
      method: "PATCH",
      body: form,
    });
    useToast({
      type: "success",
      title: "Sucesso!",
      description: "Pessoa atualizada com sucesso",
    });
    resetForm();
    emit("submit");
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description:
        error instanceof Error ? error.message : "Erro ao atualizar pessoa",
    });
  }
};

const getData = async () => {
  try {
    const { person } = await $fetch<{ person: Person }>(
      `/api/people/${props.id}`,
    );
    form.first_name = person.first_name;
    form.last_name = person.last_name;
    form.color = person.color ?? "";
  } catch (error) {
    useToast({
      type: "error",
      title: "Erro!",
      description:
        error instanceof Error ? error.message : "Erro ao buscar pessoa",
    });
  }
};

onMounted(() => {
  props.id && getData();
});

const resetForm = () => {
  form.first_name = "";
  form.last_name = "";
  form.color = "";
};
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div class="grid gap-4 sm:grid-cols-2">
      <shared-input
        id="first_name"
        v-model="form.first_name"
        icon="mdi:account"
        label="Nome"
        placeholder="Primeiro nome"
        required
      />
      <shared-input
        id="last_name"
        v-model="form.last_name"
        icon="mdi:account"
        label="Sobrenome"
        placeholder="Sobrenome"
        required
      />
    </div>
    <div class="max-w-xs space-y-2">
      <Label for="color">Cor (opcional)</Label>
      <div class="grid grid-cols-6 gap-2">
        <template v-for="color in colors" :key="color.name">
          <button
            type="button"
            :class="[
              'flex items-center justify-center rounded-full border transition focus:outline-none focus:ring-2',
              'size-8',
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
    <DialogFooter class="grid lg:grid-cols-2 gap-2">
      <DialogClose as-child>
        <Button variant="outline">Cancelar</Button>
      </DialogClose>
      <Button type="submit">Salvar</Button>
    </DialogFooter>
  </form>
</template>
