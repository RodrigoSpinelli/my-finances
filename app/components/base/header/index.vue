<script setup lang="ts">
import { LogOut, Menu, PiggyBankIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const mobileNavOpen = ref(false);
const userMenuOpen = ref(false);

const navItems = [
  { to: "/", label: "Início" },
  { to: "/categories", label: "Categorias" },
  { to: "/transactions", label: "Transações" },
  { to: "/profile", label: "Perfil" },
] as const;

const linkClass =
  "text-muted-foreground hover:text-foreground text-sm font-medium transition-colors";

const displayName = computed(() => {
  const meta = user.value?.user_metadata as { display_name?: string } | undefined;
  const name = meta?.display_name?.trim();
  if (name) return name;
  const email = user.value?.email;
  if (email) {
    const local = email.split("@")[0] ?? "";
    if (local) return local;
  }
  return "Usuário";
});

const userEmail = computed(() => user.value?.email ?? "");

async function signOut() {
  userMenuOpen.value = false;
  await supabase.auth.signOut();
  await navigateTo("/login");
}

function closeMobileNav() {
  mobileNavOpen.value = false;
}
</script>

<template>
  <nav
    class="bg-background/95 supports-backdrop-filter:bg-background/60 border-b backdrop-blur fixed top-0 left-0 right-0 z-50"
  >
    <div
      class="mx-auto flex max-w-5xl items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3"
    >
      <div class="flex min-w-0 flex-1 items-center gap-2 md:flex-none md:gap-4">
        <div class="shrink-0 md:hidden">
          <Drawer
            v-model:open="mobileNavOpen"
            direction="left"
            :should-scale-background="true"
          >
            <DrawerTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="shrink-0"
                aria-label="Abrir menu"
              >
                <Menu class="size-5" />
              </Button>
            </DrawerTrigger>
          <DrawerContent class="max-w-xs">
            <DrawerHeader class="text-left">
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <nav class="flex flex-col gap-1 px-4 pb-6">
              <DrawerClose
                v-for="item in navItems"
                :key="item.to"
                as-child
              >
                <NuxtLink
                  :to="item.to"
                  class="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  active-class="bg-accent text-foreground"
                  @click="closeMobileNav"
                >
                  {{ item.label }}
                </NuxtLink>
              </DrawerClose>
            </nav>
          </DrawerContent>
          </Drawer>
        </div>

        <NuxtLink
          to="/"
          class="text-primary flex shrink-0 items-center rounded-md outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Ir para início"
        >
          <PiggyBankIcon
            class="size-6 shrink-0 sm:size-7"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>

      <div
        class="hidden min-w-0 flex-1 items-center justify-center gap-4 md:flex md:gap-6 lg:gap-8"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="linkClass"
          active-class="!text-primary"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ClientOnly>
          <shared-toggle-color-mode aria-label="Alternar modo claro/escuro" />
        </ClientOnly>

        <Popover v-model:open="userMenuOpen">
          <PopoverTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="rounded-full"
              aria-label="Menu da conta"
              aria-haspopup="menu"
            >
              <shared-avatar />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            class="w-72 p-0"
            align="end"
            :side-offset="8"
          >
            <div class="border-b px-3 py-3">
              <p class="truncate text-sm font-medium">
                {{ displayName }}
              </p>
              <p
                v-if="userEmail"
                class="text-muted-foreground truncate text-xs"
              >
                {{ userEmail }}
              </p>
            </div>
            <div class="p-1">
              <Button
                variant="ghost"
                class="h-auto w-full justify-start gap-2 px-3 py-2 font-normal"
                @click="signOut"
              >
                <LogOut class="size-4 opacity-70" />
                Sair
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </nav>
</template>
