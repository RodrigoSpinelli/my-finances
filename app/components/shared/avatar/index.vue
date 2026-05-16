<script setup lang="ts">
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { initialsFromAuthUser } from "~/utils/auth-display-name";

const user = useSupabaseUser();

const initials = computed(() => initialsFromAuthUser(user.value));
</script>

<template>
  <Avatar>
    <AvatarFallback class="text-xs">{{ initials }}</AvatarFallback>
  </Avatar>
</template>
