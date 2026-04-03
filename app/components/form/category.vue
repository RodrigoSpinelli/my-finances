<script setup lang="ts">
import { DialogFooter } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Category } from "~/interfaces/category";
import type { Tables } from "~/types/database.types";

const props = defineProps<{
  id?: string;
}>();

interface Form {
  name: string;
  type: Category["type"];
  color: string;
  iconId: string;
}

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const form = reactive<Form>({
  name: "",
  type: "expense",
  color: "",
  iconId: "",
});

const icons = ref<Tables<"icons">[]>([]);
const iconsPending = ref(true);
const iconPickerOpen = ref(false);

const selectedIcon = computed(() =>
  icons.value.find(i => i.id === form.iconId),
);

function pickIcon(id: string) {
  form.iconId = id;
  iconPickerOpen.value = false;
}

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

async function loadIcons() {
  iconsPending.value = true;
  try {
    const { icons: list } = await $fetch<{ icons: Tables<"icons">[] }>(
      "/api/icons",
    );
    icons.value = list;
    if (!props.id && list[0] && !form.iconId) {
      form.iconId = list[0].id;
    }
  } catch {
    useToast({
      type: "error",
      title: "Erro!",
      description: "Não foi possível carregar os ícones",
    });
  } finally {
    iconsPending.value = false;
  }
}

async function syncFormToProps() {
  if (props.id) {
    await getData();
  } else {
    resetForm();
  }
}

onMounted(async () => {
  await loadIcons();
  await syncFormToProps();
});

watch(
  () => props.id,
  async () => {
    if (!icons.value.length) {
      await loadIcons();
    }
    await syncFormToProps();
  },
);

const submit = () => {
  props.id ? update() : create();
};

const create = async () => {
  try {
    await $fetch("/api/categories", {
      method: "POST",
      body: {
        name: form.name,
        type: form.type,
        color: form.color || null,
        icon_id: form.iconId,
      },
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
      body: {
        name: form.name,
        type: form.type,
        color: form.color,
        icon_id: form.iconId,
      },
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
  if (!props.id) return;
  try {
    const { category } = await $fetch<{ category: Category }>(
      `/api/categories/${props.id}`,
    );
    form.name = category.name;
    form.type = category.type;
    form.color = category.color ?? "";
    form.iconId = category.icon_id;
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
  form.iconId = icons.value[0]?.id ?? "";
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
    <div class="space-y-2">
      <Label for="category_icon">Ícone</Label>
      <Popover v-model:open="iconPickerOpen">
        <PopoverTrigger as-child>
          <Button
            id="category_icon"
            type="button"
            variant="outline"
            role="combobox"
            :aria-expanded="iconPickerOpen"
            aria-haspopup="dialog"
            aria-controls="category-icon-grid"
            class="h-11 w-full justify-between gap-2 px-3 font-normal"
            :disabled="iconsPending || icons.length === 0"
          >
            <span class="flex min-w-0 items-center gap-2">
              <Icon
                v-if="selectedIcon"
                :name="selectedIcon.name"
                class="size-5 shrink-0"
              />
              <span
                class="truncate text-left text-sm"
                :class="
                  selectedIcon ? 'text-foreground' : 'text-muted-foreground'
                "
              >
                {{
                  selectedIcon?.name ?? "Selecione um ícone"
                }}
              </span>
            </span>
            <Icon
              name="lucide:chevrons-up-down"
              class="text-muted-foreground size-4 shrink-0 opacity-60"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id="category-icon-grid"
          class="w-[min(calc(100vw-2rem),20rem)] p-3 sm:w-80"
          align="start"
          :side-offset="4"
        >
          <p class="text-muted-foreground mb-2 text-xs font-medium">
            Escolha um ícone
          </p>
          <div
            class="max-h-[min(50vh,280px)] overflow-y-auto overflow-x-hidden pr-0.5"
          >
            <div class="grid grid-cols-6 gap-1.5">
              <Button
                v-for="ic in icons"
                :key="ic.id"
                type="button"
                :variant="form.iconId === ic.id ? 'secondary' : 'outline'"
                size="icon"
                class="size-9 shrink-0"
                :title="ic.name"
                :aria-label="`Ícone ${ic.name}`"
                :aria-pressed="form.iconId === ic.id"
                @click="pickIcon(ic.id)"
              >
                <Icon :name="ic.name" class="size-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
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
      <Button
        type="submit"
        :disabled="
          iconsPending || !form.iconId || icons.length === 0
        "
      >
        Salvar
      </Button>
    </DialogFooter>
  </form>
</template>
