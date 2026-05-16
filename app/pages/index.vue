<script setup lang="ts">
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  LayoutDashboard,
  PieChart,
  Shield,
  Sparkles,
  Tags,
  Target,
  Wallet,
  Zap,
} from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
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

const heroBenefits = [
  "Cadastro rápido e gratuito",
  "Interface em português",
  "Ideal para uso pessoal",
] as const;

const previewMeshBackgroundImage =
  "radial-gradient(ellipse 90% 80% at 8% 6%, rgb(148 201 255 / 0.95), transparent 55%), radial-gradient(ellipse 80% 72% at 92% 8%, rgb(130 71 255 / 0.92), transparent 52%), radial-gradient(ellipse 100% 88% at 45% 100%, rgb(214 209 255 / 1), transparent 54%), radial-gradient(ellipse 52% 50% at 22% 58%, rgb(45 49 250 / 0.78), transparent 48%), linear-gradient(152deg, #2d31fa 0%, #5746f5 32%, #8247ff 55%, #b8aaf8 76%, #d6d1ff 100%)";

const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    description: "Cadastre-se em segundos e entre no painel com um visual limpo.",
  },
  {
    number: "02",
    title: "Registre o essencial",
    description: "Lance receitas e despesas e organize categorias ao seu modo.",
  },
  {
    number: "03",
    title: "Enxergue o mês inteiro",
    description: "Acompanhe saldo, distribuição e meta de gastos sem planilhas.",
  },
] as const;

const trustPoints = [
  {
    icon: Zap,
    label: "Lançamentos rápidos",
    hint: "Menos atrito para manter o hábito",
  },
  {
    icon: Shield,
    label: "Foco na privacidade",
    hint: "Você no controle das suas informações",
  },
  {
    icon: Sparkles,
    label: "UX pensada para o cotidiano",
    hint: "Textos e fluxos diretos ao ponto",
  },
] as const;

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
  {
    icon: BarChart3,
    title: "Leitura clara das tendências",
    description:
      "Compare períodos e perceba padrões antes de virar problema no fim do mês.",
  },
] as const;
</script>

<template>
  <div>
    <section class="relative overflow-hidden">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(124,92,246,0.18),transparent_55%),radial-gradient(ellipse_80%_60%_at_100%_40%,rgba(236,72,153,0.08),transparent_50%),linear-gradient(to_bottom,hsl(var(--muted)/0.35)_0%,hsl(var(--background))_40%,hsl(var(--background))_100%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(124,92,246,0.22),transparent_55%),radial-gradient(ellipse_80%_60%_at_100%_40%,rgba(236,72,153,0.1),transparent_50%),linear-gradient(to_bottom,hsl(var(--muted)/0.2)_0%,hsl(var(--background))_45%,hsl(var(--background))_100%)]"
      />
      <div class="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
        <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
          <div class="text-center lg:col-span-6 lg:text-left">
            <div
              class="mb-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
            >
              <Badge variant="secondary" class="font-medium tracking-wide uppercase">
                Controle financeiro pessoal
              </Badge>
              <Badge variant="outline" class="border-primary/25 text-primary gap-1.5 px-3">
                <Sparkles class="size-3.5" aria-hidden="true" />
                Novidades em evolução
              </Badge>
            </div>
            <h1
              class="text-foreground text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]"
            >
              Suas finanças, organizadas com o cuidado de um
              <span
                class="bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text font-bold text-transparent"
              >porquinho</span>.
            </h1>
            <p
              class="text-muted-foreground mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0"
            >
              Registre o que entra e o que sai, categorize com clareza e use
              gráficos para enxergar padrões — tudo em português e pronto para o
              dia a dia.
            </p>

            <ul
              class="text-muted-foreground mx-auto mt-6 flex max-w-xl flex-col gap-2 text-sm sm:text-base lg:mx-0"
            >
              <li
                v-for="line in heroBenefits"
                :key="line"
                class="flex items-center justify-center gap-2 lg:justify-start"
              >
                <CheckCircle2
                  class="text-primary size-5 shrink-0"
                  aria-hidden="true"
                />
                <span>{{ line }}</span>
              </li>
            </ul>

            <div
              class="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start"
            >
              <Button size="lg" class="gap-2 px-8 shadow-lg shadow-primary/20" as-child>
                <NuxtLink to="/register">
                  Começar agora
                  <ArrowRight class="size-4" />
                </NuxtLink>
              </Button>
              <Button size="lg" variant="outline" class="backdrop-blur-sm" as-child>
                <NuxtLink to="/login">
                  Já tenho conta
                </NuxtLink>
              </Button>
            </div>
          </div>

          <div class="relative mx-auto w-full max-w-lg lg:col-span-6 lg:mx-0 lg:max-w-none">
            <div
              class="relative isolate min-h-80 overflow-hidden rounded-[1.75rem] shadow-2xl ring-1 ring-black/5 dark:shadow-primary/15 dark:ring-white/10 sm:min-h-88 lg:min-h-104"
              :style="{ backgroundImage: previewMeshBackgroundImage }"
            >
              <div
                class="absolute inset-px rounded-[calc(1.75rem-1px)] bg-linear-to-b from-white/12 via-transparent to-black/12 dark:from-white/6"
                aria-hidden="true"
              />
              <div class="relative flex h-full flex-col justify-between gap-6 p-7 sm:p-8">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-sm font-medium text-white/85">Visão do mês</p>
                    <p class="mt-2 text-xs text-white/70">Atualizado com seus lançamentos</p>
                  </div>
                  <div
                    class="rounded-xl border border-white/20 bg-black/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur-md dark:bg-black/35"
                  >
                    Demo visual
                  </div>
                </div>

                <div class="rounded-2xl border border-white/25 bg-black/25 p-4 shadow-xl backdrop-blur-xl dark:bg-black/40">
                  <p class="text-xs font-medium text-white/80">Saldo do mês</p>
                  <p class="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    R$ 4.280<span class="text-lg font-medium text-white/70">,00</span>
                  </p>
                  <p class="mt-2 inline-flex items-center gap-2 text-xs text-emerald-200/95">
                    <span class="inline-flex size-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
                    +12% vs. mês anterior (exemplo)
                  </p>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                  <div
                    class="rounded-2xl border border-white/20 bg-black/18 p-4 backdrop-blur-md dark:bg-black/30"
                  >
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/75">
                      <Target class="size-3.5" aria-hidden="true" />
                      Meta de gastos
                    </div>
                    <div class="mt-3 flex items-end justify-between gap-2">
                      <p class="text-lg font-semibold text-white">
                        68%
                      </p>
                      <p class="text-xs text-white/70">
                        dentro do planejado
                      </p>
                    </div>
                    <div
                      class="mt-3 h-2 overflow-hidden rounded-full bg-white/15"
                      role="presentation"
                    >
                      <div
                        class="h-full rounded-full bg-white/95"
                        style="width: 68%"
                      />
                    </div>
                  </div>
                  <div
                    class="rounded-2xl border border-white/20 bg-black/18 p-4 backdrop-blur-md dark:bg-black/30"
                  >
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/75">
                      <PieChart class="size-3.5" aria-hidden="true" />
                      Top categoria
                    </div>
                    <p class="mt-4 text-lg font-semibold leading-snug text-white">
                      Mercado
                    </p>
                    <p class="mt-2 text-xs text-white/65">
                      34% das despesas do mês (exemplo ilustrativo)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="border-primary/25 bg-card/85 text-muted-foreground absolute -bottom-10 -right-2 hidden max-w-56 rotate-3 gap-3 rounded-xl border px-4 py-3 text-xs shadow-xl backdrop-blur-xl sm:flex sm:flex-col xl:-right-4"
              aria-hidden="true"
            >
              <div class="text-foreground flex items-center gap-2 text-sm font-medium">
                <LayoutDashboard class="text-primary size-4 shrink-0" />
                Fluxo sempre visível
              </div>
              <p class="leading-relaxed">
                Painel pensado para respostas rápidas, sem navegar por telas extras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-border/70 border-y bg-muted/35 py-11 sm:py-14 dark:bg-muted/20">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:gap-10">
        <div
          v-for="point in trustPoints"
          :key="point.label"
          class="flex gap-4"
        >
          <div class="relative">
            <div
              class="bg-background text-primary flex size-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5 dark:ring-white/10"
            >
              <component :is="point.icon" class="size-5" aria-hidden="true" />
            </div>
          </div>
          <div>
            <p class="text-base font-semibold tracking-tight">
              {{ point.label }}
            </p>
            <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
              {{ point.hint }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
          Em três passos você já ganha direção
        </h2>
        <p class="text-muted-foreground mt-4 text-base leading-relaxed">
          Fluxo pensado para manter cadência sem transformar suas finanças em
          “mais um trabalho pesado”.
        </p>
      </div>
      <div class="mt-14 grid gap-6 lg:grid-cols-3">
        <Card
          v-for="step in steps"
          :key="step.number"
          class="relative overflow-hidden pb-6 border-border/70 bg-linear-to-br from-background to-muted/30 shadow-lg ring-1 ring-black/4 dark:to-muted/10 dark:ring-white/5"
        >
          <CardHeader class="gap-4">
            <p class="bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent opacity-95">
              {{ step.number }}
            </p>
            <CardTitle class="text-xl tracking-tight">
              {{ step.title }}
            </CardTitle>
            <CardDescription class="text-base leading-relaxed">
              {{ step.description }}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24">
      <div class="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/12 via-background to-background px-8 py-12 shadow-inner ring-1 ring-primary/10 sm:p-14 dark:from-primary/10">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(99,102,241,0.35),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(236,72,153,0.18),transparent_40%)] opacity-75 dark:opacity-90"
        />
        <div class="relative flex flex-col items-center gap-5 text-center">
          <h2 class="text-foreground text-balance text-2xl font-semibold tracking-tight sm:text-3xl lg:text-[2rem]">
            Tudo o que você precisa no seu ritmo — sem dor de gestão
          </h2>
          <p class="text-muted-foreground max-w-prose text-base leading-relaxed sm:text-[1.05rem]">
            Funcionalidades desenhadas para quem quer praticidade, não mais uma ferramenta exigindo manutenção pesada todos os dias.
          </p>
        </div>
      </div>
      <div
        class="-mt-6 grid gap-6 sm:-mt-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
      >
        <Card
          v-for="item in features"
          :key="item.title"
          class="border-border/80 bg-card/90 pb-6 backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-card/80"
        >
          <CardHeader class="gap-3">
            <div
              class="bg-primary/10 text-primary inline-flex size-10 items-center justify-center rounded-xl"
            >
              <component
                :is="item.icon"
                class="size-5"
                aria-hidden="true"
              />
            </div>
            <CardTitle class="text-lg tracking-tight">
              {{ item.title }}
            </CardTitle>
            <CardDescription class="text-base leading-relaxed">
              {{ item.description }}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>

    <section class="relative overflow-hidden pt-10 pb-24 sm:pt-12 sm:pb-28">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          class="rounded-4xl px-8 py-16 text-center shadow-2xl sm:px-12 sm:py-20 lg:rounded-[2.25rem]"
          style="
            background-image:
              radial-gradient(ellipse 100% 100% at 0% 40%, rgb(214 209 255 / 0.5), transparent 55%),
              radial-gradient(ellipse 90% 90% at 100% 0%, rgb(130 71 255 / 0.45), transparent 50%),
              linear-gradient(145deg, #2d31fa 0%, #5746f5 32%, #a855f7 68%, #d6d1ff 100%);
          "
        >
          <h2 class="mx-auto max-w-2xl text-balance text-2xl font-semibold tracking-tight text-white shadow-sm sm:text-3xl lg:text-[2rem] lg:leading-tight">
            Pronto para colocar ordem no bolso sem complicação?
          </h2>
          <p
            class="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/90 sm:text-[1.05rem]"
          >
            Crie sua conta em poucos minutos e comece a registrar suas movimentações
            hoje — com cadência leve para manter o hábito.
          </p>
          <div
            class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              variant="outline"
              class="gap-2 border-transparent bg-white px-10 text-zinc-950 shadow-lg shadow-black/25 hover:bg-white/92 hover:text-zinc-950 dark:border-transparent dark:bg-white dark:text-zinc-950 dark:hover:bg-white/92 dark:hover:text-zinc-950"
              as-child
            >
              <NuxtLink to="/register">
                Criar conta grátis
                <ArrowRight class="size-4" />
              </NuxtLink>
            </Button>
            <Button
              size="lg"
              variant="outline"
              class="border-white/40 bg-white/15 text-white shadow-md backdrop-blur-md hover:bg-white/25 hover:text-white"
              as-child
            >
              <NuxtLink to="/login">
                Entrar
              </NuxtLink>
            </Button>
          </div>
          <div class="mt-8 inline-flex flex-wrap justify-center gap-3 text-[0.775rem] text-white/85 sm:text-sm">
            <span class="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 backdrop-blur">
              Cadastro rápido
            </span>
            <span class="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 backdrop-blur">
              Sem atrito excessivo nos lançamentos
            </span>
            <span class="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 backdrop-blur">
              Feito para o seu dia a dia
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
