<script setup lang="ts">
import { WalletIcon, ArrowUpIcon } from "lucide-vue-next";
</script>

<template>
  <Card>
    <CardHeader
      class="gap-4 flex flex-wrap items-center justify-between border-b"
    >
      <CardTitle>Saldo atual</CardTitle>
      <WalletIcon />
    </CardHeader>
    <CardContent>
      <div class="flex items-center justify-between">
        <h3 class="text-2xl font-bold">R$ 100,00</h3>
        <Badge size="sm" variant="outline">
          <ArrowUpIcon />
          +7%
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>
