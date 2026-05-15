<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{ iconClass?: string }>(),
  {
    iconClass: "size-6 shrink-0 sm:size-7",
  },
);

/** SVG fragment ids must be unique per instance when multiple logos render on one page. */
const gradientId = `pf-logo-grad-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
const strokePaint = `url(#${gradientId})`;
</script>

<template>
  <span class="inline-flex shrink-0 opacity-95">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      :stroke="strokePaint"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-piggy-bank-icon lucide-piggy-bank"
      :class="cn(props.iconClass)"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          :id="gradientId"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stop-color="#8b5cf6" />
          <stop offset="50%" stop-color="#a855f7" />
          <stop offset="100%" stop-color="#d946ef" />
        </linearGradient>
      </defs>
      <path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z" />
      <path d="M16 10h.01" />
      <path d="M2 8v1a2 2 0 0 0 2 2h1" />
    </svg>
  </span>
</template>
