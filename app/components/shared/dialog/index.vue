<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@vueuse/core";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
const isDesktop = useMediaQuery("(min-width: 640px)");
const Modal = computed(() => ({
  Root: isDesktop.value ? Dialog : Drawer,
  Trigger: isDesktop.value ? DialogTrigger : DrawerTrigger,
  Content: isDesktop.value ? DialogContent : DrawerContent,
  Header: isDesktop.value ? DialogHeader : DrawerHeader,
  Title: isDesktop.value ? DialogTitle : DrawerTitle,
  Description: isDesktop.value ? DialogDescription : DrawerDescription,
}));

const { formComponents } = useFormComponents();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

defineProps<{
  title: string;
  description?: string;
  form: FormComponentKey;
  formProps?: Record<string, unknown>;
}>();

const handleSubmit = () => {
  emit("submit");
  isOpen.value = false;
};

const isOpen = defineModel<boolean>();
</script>

<template>
  <Modal.Root v-model:open="isOpen">
    <Modal.Trigger as-child>
      <slot name="trigger" />
    </Modal.Trigger>
    <Modal.Content class="p-8">
      <Modal.Header>
        <Modal.Title>{{ title }}</Modal.Title>
        <Modal.Description v-if="description">{{
          description
        }}</Modal.Description>
      </Modal.Header>
      <div class="space-y-4">
        <component
          :is="formComponents[form]"
          v-bind="formProps ?? {}"
          @submit="handleSubmit"
          @cancel="isOpen = false"
        />
      </div>
    </Modal.Content>
  </Modal.Root>
</template>
