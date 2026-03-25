<script setup lang="ts">
const { data } = await useFetch('/api/people')
</script>

<template>
  <div>
    <Button>Click me</Button>
    <pre>{{ data }}</pre>
  </div>
</template>