<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { TableHeaders } from "~/interfaces/table";

interface TableProps {
  headers: TableHeaders[];
  caption?: string;
  isLoading?: boolean;
}

defineProps<TableProps>();

function headClass(header: TableHeaders) {
  return cn(
    header.align === "right" && "text-right",
    header.align === "center" && "text-center",
    header.class,
  );
}
</script>

<template>
  <div class="rounded-md border p-2">
    <Table>
      <TableCaption v-if="caption">{{ caption }}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead
            v-for="header in headers"
            :key="header.label"
            :class="headClass(header)"
          >
            {{ header.label }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <slot v-if="!isLoading" />
        <TableEmpty v-else>
          <div class="flex items-center justify-center">
            <Icon name="lucide:loader-circle" class="animate-spin" />
            Carregando…
          </div>
        </TableEmpty>
      </TableBody>
    </Table>
  </div>
</template>
