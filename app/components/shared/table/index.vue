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
  length: number;
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
  <div class="rounded-md border px-1">
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
        <TableRow
          v-if="length === 0"
          class="border-0 hover:bg-transparent"
        >
          <TableCell :colspan="headers.length" class="border-0">
            <div class="flex items-center justify-center py-12">
              <div class="flex flex-col items-center gap-2">
                <div
                  class="size-12 rounded-full bg-muted/50 flex items-center justify-center"
                >
                  <Icon
                    :name="isLoading ? 'lucide:loader-circle' : 'lucide:inbox'"
                    class="size-6 text-muted-foreground/50"
                    :class="{ 'animate-spin': isLoading }"
                  />
                </div>
                <p class="text-sm font-medium text-muted-foreground">
                 {{ isLoading ? "Carregando..." : "Nenhum registro encontrado" }}
                </p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
