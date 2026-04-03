<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { ChevronDownIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface CalendarProps {
  label?: string;
  placeholder: string;
}

defineProps<CalendarProps>();

const date = defineModel<DateValue | undefined>()
</script>

<template>
  <div class="space-y-2">
    <Label v-if="label" for="date" class="px-1">
      {{ label }}
    </Label>
    <Popover v-slot="{ close }">
      <PopoverTrigger as-child>
        <Button
          id="date"
          variant="outline"
          class="w-full justify-between font-normal"
          :class="{ 'text-muted-foreground': !date }"
        >
          {{ date ? date.toDate(getLocalTimeZone()).toLocaleDateString("pt-BR") : placeholder }}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto overflow-hidden p-0" align="start">
        <Calendar
          :model-value="date"
          layout="month-only"
          locale="pt-BR"
          @update:model-value="(value) => {
            if (value) {
              date = value
              close()
            }
          }"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
