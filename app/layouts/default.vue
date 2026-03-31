<script setup lang="ts">
const { getPreferences } = useUserStore();
const { preferences } = storeToRefs(useUserStore());

onMounted(async () => preferences.value && getPreferences());
</script>

<template>
  <div>
    <AppMenu />
    <slot />
    <base-footer />
  </div>
</template>
