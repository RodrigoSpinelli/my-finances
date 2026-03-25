<script setup lang="ts">
import { DialogFooter } from "@/components/ui/dialog";
interface Form {
  first_name: string;
  last_name: string;
  color: string;
}

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "close"): void;
}>();

const form = reactive<Form>({
  first_name: "",
  last_name: "",
  color: "",
});

const colors = [
  {
    name: "red",
    bg: "bg-red-600",
    ring: "ring-red-500",
    border: "border-red-500",
  },
  {
    name: "yellow",
    bg: "bg-yellow-400",
    ring: "ring-yellow-400",
    border: "border-yellow-400",
  },
  {
    name: "green",
    bg: "bg-green-400",
    ring: "ring-green-500",
    border: "border-green-500",
  },
  {
    name: "cyan",
    bg: "bg-cyan-500",
    ring: "ring-cyan-500",
    border: "border-cyan-500",
  },
  {
    name: "purple",
    bg: "bg-purple-500",
    ring: "ring-purple-500",
    border: "border-purple-500",
  },
  {
    name: "pink",
    bg: "bg-pink-500",
    ring: "ring-pink-500",
    border: "border-pink-500",
  },
];

const submit = () => {
  console.log(form);
  useToast({
    type: "success",
    title: "Sucesso!",
    description: "Pessoa cadastrada com sucesso",
  });
  emit("submit");
  emit("close");
};

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
    <pre>{{ form }}</pre>
  </form>
</template>
