<script setup lang="ts">
import { Minus, Plus } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const { formComponents } = useFormComponents();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

defineProps<{
  form: FormComponentKey;
  title: string;
  description?: string;
  id?: string;
  /** Props repassadas ao formulário dinâmico (ex.: `{ month: '2026-03' }`). */
  formProps?: Record<string, unknown>;
}>();

const model = defineModel<boolean>();

const handleSubmit = () => {
  model.value = false;
  emit("submit");
};
</script>

<template>
  <Drawer v-model:open="model">
    <DrawerTrigger as-child>
      <slot name="trigger" />
    </DrawerTrigger>
    <DrawerContent>
      <div class="mx-auto w-full max-w-sm py-4">
        <DrawerHeader class="text-center">
          <DrawerTitle>{{ title }}</DrawerTitle>
          <DrawerDescription>{{ description }}</DrawerDescription>
        </DrawerHeader>
        <component
          :is="formComponents[form]"
          v-bind="formProps ?? {}"
          :id="id"
          @submit="handleSubmit"
        />
      </div>
    </DrawerContent>
  </Drawer>
</template>
