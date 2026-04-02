<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription v-if="description">{{
          description
        }}</DialogDescription>
      </DialogHeader>
      <div class="space-y-4">
        <component
          :is="formComponents[form]"
          v-bind="formProps ?? {}"
          @submit="handleSubmit"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
