<template>
  <main class="grid min-h-dvh grid-cols-1 overflow-x-hidden lg:grid-cols-2">
    <div class="flex min-h-0 p-3 sm:p-4 lg:h-dvh lg:items-stretch">
      <div
        class="relative flex min-h-40 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl sm:min-h-48 sm:rounded-3xl"
        style="
          background-image:
            radial-gradient(
              ellipse 90% 80% at 8% 6%,
              rgb(148 201 255 / 0.95),
              transparent 55%
            ),
            radial-gradient(
              ellipse 80% 72% at 92% 8%,
              rgb(130 71 255 / 0.92),
              transparent 52%
            ),
            radial-gradient(
              ellipse 100% 88% at 45% 100%,
              rgb(214 209 255 / 1),
              transparent 54%
            ),
            radial-gradient(
              ellipse 52% 50% at 22% 58%,
              rgb(45 49 250 / 0.78),
              transparent 48%
            ),
            linear-gradient(
              152deg,
              #2d31fa 0%,
              #5746f5 32%,
              #8247ff 55%,
              #b8aaf8 76%,
              #d6d1ff 100%
            );
        "
      >
        <div
          class="relative z-10 mt-auto max-w-lg space-y-2 p-6 text-white sm:space-y-3 sm:p-8 lg:p-12"
          style="
            text-shadow:
              0 1px 2px rgb(23 29 71 / 0.25),
              0 4px 16px rgb(45 49 250 / 0.12);
          "
        >
          <p class="text-sm font-medium text-white/90">Com tranquilidade</p>
          <h2 class="text-balance text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:text-3xl">
            Seu centro de clareza para planejar gastos e alcançar metas financeiras.
          </h2>
        </div>
      </div>
    </div>
    <div
      class="flex min-h-0 flex-1 flex-col justify-center px-4 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-10 lg:px-12 lg:pb-16 xl:px-20"
    >
      <div class="mx-auto w-full min-w-0 max-w-lg">
        <slot />
      </div>
    </div>
  </main>
</template>
