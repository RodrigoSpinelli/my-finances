<script setup lang="ts">
const { getPreferences } = useUserStore();
const { preferences, pending } = storeToRefs(useUserStore());

onMounted(() => {
  if (preferences.value === undefined) {
    getPreferences();
  }
});
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
