<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  initialsFromAuthUser,
  resolveAuthAvatarUrl,
  resolveAuthDisplayFallback,
} from "~/utils/auth-display-name";

const user = useSupabaseUser();

const initials = computed(() => initialsFromAuthUser(user.value));
const avatarUrl = computed(() => resolveAuthAvatarUrl(user.value));

const avatarAlt = computed(() => {
  const name = resolveAuthDisplayFallback(user.value);
  return name === "Usuário" ? "Foto do perfil" : `Foto de ${name}`;
});
</script>

<template>
  <Avatar>
    <AvatarImage
      v-if="avatarUrl"
      :key="avatarUrl"
      :src="avatarUrl"
      :alt="avatarAlt"
      class="size-full object-cover"
    />
    <AvatarFallback class="text-xs">{{ initials }}</AvatarFallback>
  </Avatar>
</template>
