<script setup lang="ts">
import type { ClassValue } from "clsx";

import { cn } from "@/lib/utils";

const BRAND_NAME = "Porquinho Financeiro";

type LogoLinkVariant = "app-nav" | "auth-nav" | "marketing-nav" | "footer-brand";

type Preset = {
  defaultTo: string;
  showLabel: boolean;
  iconClass: string;
  ariaLabel: string;
  linkClass: ClassValue;
  labelClass?: ClassValue;
};

const PRESETS = {
  "app-nav": {
    defaultTo: "/dashboard",
    showLabel: false,
    iconClass: "size-6 shrink-0 sm:size-7",
    ariaLabel: "Ir para início",
    linkClass:
      "flex shrink-0 items-center rounded-md outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring",
  },
  "auth-nav": {
    defaultTo: "/",
    showLabel: true,
    iconClass: "size-8 shrink-0 sm:size-9",
    ariaLabel: `${BRAND_NAME} — voltar ao início`,
    linkClass:
      "flex min-w-0 items-center gap-2 rounded-lg outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring",
    labelClass:
      "text-foreground truncate text-sm font-semibold tracking-tight sm:text-base",
  },
  "marketing-nav": {
    defaultTo: "/",
    showLabel: true,
    iconClass: "size-7 shrink-0 sm:size-8",
    ariaLabel: `${BRAND_NAME} — início`,
    linkClass:
      "flex items-center gap-2 rounded-md outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring",
    labelClass:
      "text-foreground text-sm font-semibold tracking-tight sm:text-base",
  },
  "footer-brand": {
    defaultTo: "/",
    showLabel: true,
    iconClass: "size-5 shrink-0 sm:size-6",
    ariaLabel: `${BRAND_NAME} — início`,
    linkClass:
      "inline-flex items-center gap-2 rounded-md text-inherit outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring",
    labelClass: "text-foreground font-semibold",
  },
} satisfies Record<LogoLinkVariant, Preset>;

const props = withDefaults(
  defineProps<{
    variant?: LogoLinkVariant;
    to?: string;
    iconClass?: string;
    /** Extra classes merged with preset label typography (variants with label only). */
    brandClass?: ClassValue;
    ariaLabel?: string;
    class?: ClassValue;
  }>(),
  { variant: "marketing-nav" },
);

const preset = computed(() => PRESETS[props.variant]);

const mergedTo = computed(() => props.to ?? preset.value.defaultTo);

const resolvedAriaLabel = computed(
  () => props.ariaLabel ?? preset.value.ariaLabel,
);

const resolvedIconClass = computed(
  () => props.iconClass ?? preset.value.iconClass,
);
</script>

<template>
  <NuxtLink
    :to="mergedTo"
    :aria-label="resolvedAriaLabel"
    :class="cn(preset.linkClass, props.class)"
  >
    <shared-logo-icon :icon-class="resolvedIconClass" />
    <span
      v-if="preset.showLabel && preset.labelClass"
      :class="cn(preset.labelClass, props.brandClass)"
    >
      {{ BRAND_NAME }}
    </span>
  </NuxtLink>
</template>
