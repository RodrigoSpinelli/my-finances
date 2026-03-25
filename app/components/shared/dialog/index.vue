<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formComponents = {
  person: defineAsyncComponent(() => import("@/components/form/person.vue")),
} as const;

type FormKey = keyof typeof formComponents;

const emit = defineEmits<{
  (e: "submit"): void;
}>();

defineProps<{
  title: string;
  description?: string;
  form: FormKey;
}>();

const isOpen = ref(false);
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
        <component :is="formComponents[form]" @submit="emit('submit')" @close="isOpen = false" />
      </div>
    </DialogContent>
  </Dialog>
</template>
