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

type ColorRow = Tables<"colors"> & { swatch_hex: string | null };

interface Form {
  name: string;
  type: Category["type"];
  colorId: string;
  iconId: string;
}

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const form = reactive<Form>({
  name: "",
  type: "expense",
  colorId: "",
  iconId: "",
});

const icons = ref<Tables<"icons">[]>([]);
const iconsPending = ref(true);
const iconPickerOpen = ref(false);

const colors = ref<ColorRow[]>([]);
const colorsPending = ref(true);
const colorPickerOpen = ref(false);

const selectedIcon = computed(() =>
  icons.value.find(i => i.id === form.iconId),
);

const selectedColor = computed(() =>
  colors.value.find(c => c.id === form.colorId),
);

function pickIcon(id: string) {
  form.iconId = id;
  iconPickerOpen.value = false;
}

function pickColor(id: string) {
  form.colorId = id;
  colorPickerOpen.value = false;
}

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

async function loadColors() {
  colorsPending.value = true;
  try {
    const { colors: list } = await $fetch<{ colors: ColorRow[] }>(
      "/api/colors",
    );
    colors.value = list;
    if (!props.id && list[0] && !form.colorId) {
      form.colorId = list[0].id;
    }
  } catch {
    useToast({
      type: "error",
      title: "Erro!",
      description: "Não foi possível carregar as cores",
    });
  } finally {
    colorsPending.value = false;
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
  await Promise.all([loadIcons(), loadColors()]);
  await syncFormToProps();
});

watch(
  () => props.id,
  async () => {
    await Promise.all([
      icons.value.length ? Promise.resolve() : loadIcons(),
      colors.value.length ? Promise.resolve() : loadColors(),
    ]);
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
        color_id: form.colorId,
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
        color_id: form.colorId,
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
    form.colorId = category.color_id;
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
  form.colorId = colors.value[0]?.id ?? "";
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
    <div class="space-y-2">
      <Label for="category_color">Cor</Label>
      <Popover v-model:open="colorPickerOpen">
        <PopoverTrigger as-child>
          <Button
            id="category_color"
            type="button"
            variant="outline"
            role="combobox"
            :aria-expanded="colorPickerOpen"
            aria-haspopup="dialog"
            aria-controls="category-color-grid"
            class="h-11 w-full justify-between gap-2 px-3 font-normal"
            :disabled="colorsPending || colors.length === 0"
            :aria-label="
              selectedColor
                ? `Cor da categoria (tom ${selectedColor.name}). Abrir para alterar`
                : 'Selecionar cor da categoria'
            "
          >
            <span class="flex min-w-0 items-center gap-2">
              <span
                class="size-5 shrink-0 rounded-full border border-black/15 ring-1 ring-black/5 dark:border-white/20 dark:ring-white/10"
                :style="
                  selectedColor?.swatch_hex
                    ? { backgroundColor: selectedColor.swatch_hex }
                    : undefined
                "
                :class="!selectedColor?.swatch_hex && 'bg-muted'"
                aria-hidden="true"
              />
              <span
                class="truncate text-left text-sm"
                :class="
                  selectedColor ? 'text-foreground' : 'text-muted-foreground'
                "
              >
                {{ selectedColor ? "Selecionada" : "Selecione uma cor" }}
              </span>
            </span>
            <Icon
              name="lucide:chevrons-up-down"
              class="text-muted-foreground size-4 shrink-0 opacity-60"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          id="category-color-grid"
          class="w-[min(calc(100vw-2rem),20rem)] p-3 sm:w-80"
          align="start"
          :side-offset="4"
        >
          <p class="text-muted-foreground mb-2 text-xs font-medium">
            Escolha uma cor
          </p>
          <div
            class="max-h-[min(50vh,280px)] overflow-y-auto overflow-x-hidden pr-0.5"
          >
            <div class="grid grid-cols-6 gap-2 p-2">
              <button
                v-for="c in colors"
                :key="c.id"
                type="button"
                :style="
                  c.swatch_hex ? { backgroundColor: c.swatch_hex } : undefined
                "
                :class="[
                  'flex size-9 items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-ring',
                  !c.swatch_hex && 'bg-muted',
                  form.colorId === c.id
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'border-black/10 hover:border-primary dark:border-white/15',
                ]"
                :aria-label="`Cor ${c.name}`"
                :aria-pressed="form.colorId === c.id"
                :title="c.name"
                @click="pickColor(c.id)"
              >
                <span
                  v-if="form.colorId === c.id"
                  class="text-[10px] font-bold text-white drop-shadow-sm"
                >
                  &#10003;
                </span>
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <DialogFooter class="grid gap-2 lg:grid-cols-2">
      <DialogClose as-child>
        <Button variant="outline">Cancelar</Button>
      </DialogClose>
      <Button
        type="submit"
        :disabled="
          iconsPending
          || colorsPending
          || !form.iconId
          || !form.colorId
          || icons.length === 0
          || colors.length === 0
        "
      >
        Salvar
      </Button>
    </DialogFooter>
  </form>
</template>
