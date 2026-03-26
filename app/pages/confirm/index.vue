<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

watch(
  user,
  () => {
    if (user.value) {
      const path = redirectInfo.pluck();
      return navigateTo(path || "/");
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="text-muted-foreground text-center text-sm">
    Confirmando sessão…
  </div>
</template>
