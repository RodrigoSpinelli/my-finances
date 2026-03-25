<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { CalendarDate, parseDate } from "@internationalized/date"
import type { DateValue } from "reka-ui"
import { Calendar } from "@/components/ui/calendar"
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-vue-next"
import { computed, ref, useId, watch } from "vue"

const props = withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    disabled?: boolean
    placeholder?: string
    /** ISO `YYYY-MM-DD` — forwarded to Calendar */
    minValue?: string
    /** ISO `YYYY-MM-DD` — forwarded to Calendar */
    maxValue?: string
    id?: string
    class?: HTMLAttributes["class"]
  }>(),
  { placeholder: "DD/MM/AAAA" },
)

const modelValue = defineModel<string | undefined>()

const autoId = useId()
const inputId = computed(() => props.id ?? autoId)
const displayValue = ref("")
const isFocused = ref(false)
const calendarOpen = ref(false)

function digitsOnly(s: string) {
  return s.replace(/\D/g, "").slice(0, 8)
}

function formatMaskedFromDigits(digits: string) {
  let out = ""
  if (digits.length >= 1)
    out += digits.slice(0, 2)
  if (digits.length >= 3)
    out += `/${digits.slice(2, 4)}`
  else if (digits.length > 2)
    out += `/${digits.slice(2)}`
  if (digits.length >= 5)
    out += `/${digits.slice(4, 8)}`
  else if (digits.length > 4)
    out += `/${digits.slice(4)}`
  return out
}

function parseDisplayToIso(display: string): string | undefined {
  const m = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m)
    return undefined
  const d = Number(m[1])
  const mo = Number(m[2])
  const y = Number(m[3])
  try {
    return new CalendarDate(y, mo, d).toString()
  }
  catch {
    return undefined
  }
}

function isoToDisplay(iso: string): string {
  try {
    const cd = parseDate(iso)
    return formatMaskedFromDigits(
      `${String(cd.day).padStart(2, "0")}${String(cd.month).padStart(2, "0")}${cd.year}`,
    )
  }
  catch {
    return ""
  }
}

function syncModelFromDisplay() {
  const iso = parseDisplayToIso(displayValue.value)
  modelValue.value = iso
}

watch(
  () => modelValue.value,
  (iso) => {
    if (isFocused.value && iso === undefined)
      return
    displayValue.value = iso ? isoToDisplay(iso) : ""
  },
  { immediate: true },
)

const calendarMin = computed(() => {
  if (!props.minValue)
    return undefined
  try {
    return parseDate(props.minValue)
  }
  catch {
    return undefined
  }
})

const calendarMax = computed(() => {
  if (!props.maxValue)
    return undefined
  try {
    return parseDate(props.maxValue)
  }
  catch {
    return undefined
  }
})

const calendarModel = computed<DateValue | undefined>({
  get() {
    const v = modelValue.value
    if (!v)
      return undefined
    try {
      return parseDate(v)
    }
    catch {
      return undefined
    }
  },
  set(v) {
    if (!v) {
      modelValue.value = undefined
      displayValue.value = ""
      return
    }
    const iso = v.toString()
    modelValue.value = iso
    displayValue.value = isoToDisplay(iso)
    calendarOpen.value = false
  },
})

function onDisplayUpdate(val: string | number) {
  const digits = digitsOnly(String(val))
  displayValue.value = formatMaskedFromDigits(digits)
  syncModelFromDisplay()
}

function onBlur() {
  isFocused.value = false
  const iso = parseDisplayToIso(displayValue.value)
  if (!iso && modelValue.value)
    displayValue.value = isoToDisplay(modelValue.value)
  else if (!iso && !modelValue.value)
    displayValue.value = ""
}

function onFocus() {
  isFocused.value = true
}
</script>

<template>
  <div :class="cn('grid gap-2', props.class)">
    <Label v-if="label" :for="inputId">
      {{ label }} {{ required ? "*" : "" }}
    </Label>
    <InputGroup :class="disabled ? 'pointer-events-none opacity-50' : ''">
      <Input
        :id="inputId"
        data-slot="input-group-control"
        :model-value="displayValue"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        maxlength="10"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-required="required"
        class="flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
        @update:model-value="onDisplayUpdate"
        @blur="onBlur"
        @focus="onFocus"
      />
      <InputGroupAddon align="inline-end">
        <Popover v-model:open="calendarOpen">
          <PopoverTrigger as-child>
            <InputGroupButton
              type="button"
              size="icon-xs"
              variant="ghost"
              :disabled="disabled"
              aria-label="Selecionar data no calendário"
            >
              <ChevronDown class="size-3.5 opacity-60" />
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0" align="end">
            <Calendar
              v-model="calendarModel"
              :min-value="calendarMin"
              :max-value="calendarMax"
              locale="pt-BR"
              initial-focus
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
