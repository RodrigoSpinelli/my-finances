<script setup lang="ts">
import {
  ArrowRight,
  LayoutDashboard,
  PieChart,
  Tags,
  Target,
  Wallet,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

definePageMeta({
  layout: "landing",
});

useHead({
  title: "Porquinho Financeiro — controle suas finanças com clareza",
  meta: [
    {
      name: "description",
      content:
        "Organize categorias, registre transações, acompanhe saldo e metas mensais com gráficos simples. Comece grátis.",
    },
  ],
});

const user = useSupabaseUser();

watch(
  () => user.value,
  (u) => {
    if (u) navigateTo("/dashboard");
  },
  { immediate: true },
);

const features = [
  {
    icon: LayoutDashboard,
    title: "Painel em um só lugar",
    description:
      "Saldo, mês anterior e visão do fluxo do mês sem planilhas complicadas.",
  },
  {
    icon: Wallet,
    title: "Transações rápidas",
    description:
      "Lance despesas e receitas e mantenha o histórico sempre atualizado.",
  },
  {
    icon: Tags,
    title: "Categorias do seu jeito",
    description:
      "Personalize categorias e ícones para refletir como você realmente gasta.",
  },
  {
    icon: Target,
    title: "Meta de gastos",
    description:
      "Defina um teto mensal e acompanhe o quanto já foi utilizado.",
  },
  {
    icon: PieChart,
    title: "Gráficos que explicam",
    description:
      "Veja distribuição por categoria e tendências para decidir melhor.",
  },
] as const;
</script>

<template>
  <div>
    <section
      class="from-muted/40 via-background to-background relative overflow-hidden bg-linear-to-b"
    >
      <div
        class="from-primary/8 pointer-events-none absolute inset-0 bg-linear-to-b via-transparent to-transparent dark:from-primary/12"
        aria-hidden="true"
      />
      <div
        class="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28"
      >
        <div class="mx-auto max-w-2xl text-center">
          <p
            class="text-primary mb-4 text-sm font-medium tracking-wide uppercase"
          >
            Controle financeiro pessoal
          </p>
          <h1
            class="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.1]"
          >
            Suas finanças, organizadas com o cuidado de um porquinho.
          </h1>
          <p
            class="text-muted-foreground mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-lg"
          >
            Registre o que entra e o que sai, categorize com clareza e use
            gráficos para enxergar padrões — tudo em português, direto ao ponto.
          </p>
          <div
            class="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            <Button size="lg" class="gap-2" as-child>
              <NuxtLink to="/register">
                Começar agora
                <ArrowRight class="size-4" />
              </NuxtLink>
            </Button>
            <Button size="lg" variant="outline" as-child>
              <NuxtLink to="/login">
                Já tenho conta
              </NuxtLink>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
          Tudo que você precisa no dia a dia
        </h2>
        <p class="text-muted-foreground mt-3 text-base">
          Funcionalidades pensadas para quem quer praticidade, não mais uma
          ferramenta difícil de manter.
        </p>
      </div>
      <div
        class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
      >
        <Card
          v-for="item in features"
          :key="item.title"
          class="border-border/80 bg-card/80 shadow-sm backdrop-blur-sm"
        >
          <CardHeader class="gap-3">
            <div
              class="bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-lg"
            >
              <component
                :is="item.icon"
                class="size-5"
                aria-hidden="true"
              />
            </div>
            <CardTitle class="text-lg">
              {{ item.title }}
            </CardTitle>
            <CardDescription class="text-base leading-relaxed">
              {{ item.description }}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>

    <section
      class="border-border from-muted/30 to-background border-y bg-linear-to-r py-16 sm:py-20"
    >
      <div
        class="mx-auto max-w-5xl px-4 text-center sm:px-6"
      >
        <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
          Pronto para colocar ordem no bolso?
        </h2>
        <p class="text-muted-foreground mx-auto mt-3 max-w-lg text-base">
          Crie sua conta em poucos minutos e comece a registrar suas
          movimentações hoje mesmo.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" class="min-w-[200px] gap-2" as-child>
            <NuxtLink to="/register">
              Criar conta grátis
              <ArrowRight class="size-4" />
            </NuxtLink>
          </Button>
          <Button size="lg" variant="ghost" as-child>
            <NuxtLink to="/login">
              Entrar
            </NuxtLink>
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>
