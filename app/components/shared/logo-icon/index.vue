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
  <span
    class="logo-icon-hit inline-flex shrink-0 opacity-90 transition-opacity duration-150 ease-in-out hover:opacity-100 motion-reduce:transition-none motion-reduce:hover:opacity-90"
  >
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
          class="logo-grad-spin"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="12"
          x2="24"
          y2="12"
        >
          <stop offset="0%" stop-color="#6d28d9" />
          <stop offset="22%" stop-color="#8b5cf6" />
          <stop offset="45%" stop-color="#c026d3" />
          <stop offset="68%" stop-color="#d946ef" />
          <stop offset="100%" stop-color="#6d28d9" />
        </linearGradient>
      </defs>
      <path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z" />
      <path d="M16 10h.01" />
      <path d="M2 8v1a2 2 0 0 0 2 2h1" />
    </svg>
  </span>
</template>

<style scoped>
.logo-grad-spin {
  transform-origin: 12px 12px;
}

@media (prefers-reduced-motion: no-preference) {
  /* Somente quando o hover está sobre o ícone — não pelo texto ao lado no link */
  .logo-icon-hit:hover .logo-grad-spin {
    animation: pf-logo-grad-flow 2.6s linear infinite;
  }
}

@keyframes pf-logo-grad-flow {
  to {
    transform: rotate(360deg);
  }
}
</style>
