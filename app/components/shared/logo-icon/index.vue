<script setup lang="ts">
import { PiggyBankIcon } from "lucide-vue-next";

import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{ iconClass?: string }>(),
  {
    iconClass: "size-6 shrink-0 sm:size-7",
  },
);

/** SVG fragment ids must be unique per instance when multiple logos render on one page. */
const gradientId = `pf-logo-grad-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
/** lucide-vue-next maps `color` onto the svg `stroke` attr (plain `stroke` is overwritten). */
const strokePaint = `url(#${gradientId})`;
</script>

<template>
  <span class="inline-flex shrink-0 opacity-95">
    <svg
      class="pointer-events-none absolute size-0 overflow-hidden opacity-0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          :id="gradientId"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset="0%"
            stop-color="#8b5cf6"
          />
          <stop
            offset="50%"
            stop-color="#a855f7"
          />
          <stop
            offset="100%"
            stop-color="#d946ef"
          />
        </linearGradient>
      </defs>
    </svg>
    <PiggyBankIcon
      :color="strokePaint"
      :class="cn(props.iconClass)"
      aria-hidden="true"
    />
  </span>
</template>
