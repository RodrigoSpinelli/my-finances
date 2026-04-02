<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const user = useSupabaseUser();

const initials = computed(() => {
  const meta = user.value?.user_metadata as { display_name?: string } | undefined;
  const fullName = meta?.display_name?.trim();
  if (fullName && fullName.length > 0) {
    const words = fullName.split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      const ch = words[0]?.[0];
      return ch ? ch.toUpperCase() : "";
    }
    const first = words[0]?.[0];
    const last = words[words.length - 1]?.[0];
    return (first ? first.toUpperCase() : "") + (last ? last.toUpperCase() : "");
  }

  const email = user.value?.email ?? "";
  if (email) {
    const namePart = (email.split("@")[0] ?? "");
    const emailWords = namePart.split(/[.\-_]/).filter(Boolean);
    if (emailWords.length > 1) {
      const first = emailWords[0]?.[0];
      const last = emailWords[emailWords.length - 1]?.[0];
      return (first ? first.toUpperCase() : "") + (last ? last.toUpperCase() : "");
    }
    const ch = namePart?.[0];
    return ch ? ch.toUpperCase() : "";
  }
  return "";
});
</script>

<template>
  <Avatar>
    <AvatarFallback class="text-xs">{{ initials }}</AvatarFallback>
  </Avatar>
</template>
