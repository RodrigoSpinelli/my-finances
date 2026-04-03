<script setup lang="ts">
import { computed } from "vue"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const props = withDefaults(
  defineProps<{
    total: number
    itemsPerPage: number
    siblingCount?: number
    showEdges?: boolean
  }>(),
  {
    siblingCount: 1,
    showEdges: true,
  },
)

const page = defineModel<number>("page", { default: 1 })

const pageCount = computed(() =>
  Math.max(1, Math.ceil(props.total / (props.itemsPerPage || 1))),
)

const showNav = computed(
  () => props.total > 0 && pageCount.value > 1,
)
</script>

<template>
  <div v-if="showNav" class="flex flex-col gap-2 pt-4">
    <Pagination
      v-model:page="page"
      :items-per-page="itemsPerPage"
      :total="total"
      :sibling-count="siblingCount"
      :show-edges="showEdges"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious>
          <span class="hidden sm:inline">Anterior</span>
        </PaginationPrevious>

        <template v-for="(item, index) in items" :key="`${item.type}-${index}`">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
          >
            {{ item.value }}
          </PaginationItem>
          <PaginationEllipsis v-else />
        </template>

        <PaginationNext>
          <span class="hidden sm:inline">Próxima</span>
        </PaginationNext>
      </PaginationContent>
    </Pagination>
  </div>
</template>
