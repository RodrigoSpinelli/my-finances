<script setup lang="ts">
const { getPreferences } = useUserStore();
const { preferences } = storeToRefs(useUserStore());

onMounted(async () => preferences.value && getPreferences());
</script>

<template>
  <div>
    <base-header />
    <div class="mb-20 mt-14">
      <slot />
    </div>
    <base-footer />
  </div>
</template>
