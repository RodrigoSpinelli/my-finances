<script setup lang="ts">
const colorMode = useColorMode();
</script>

<template>
  <Button
    type="button"
    variant="outline"
    size="sm"
    @click="
      colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
    "
  >
    <Icon name="lucide:sun" v-if="colorMode.value === 'light'" />
    <Icon name="lucide:moon" v-if="colorMode.value === 'dark'" />
  </Button>
</template>
