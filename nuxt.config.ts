import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  /** SSR + server routes on Cloudflare Pages (Workers). */
  nitro: {
    preset: "cloudflare_pages",
    routeRules: {
      "/reset-password": { ssr: false },
    },
  },

  modules: [
    "@nuxt/a11y",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/hints",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "shadcn-nuxt",
    "@nuxtjs/supabase",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@pinia/colada-nuxt",
  ],
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/register", "/recover-password", "/reset-password"],
      saveRedirectToCookie: true,
    },
    types: "~/types/database.types.ts",
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_SITE_URL,
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      title: "My Finances",
      meta: [
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        /** Legado Android / outros browsers ao “instalar”. */
        { name: "mobile-web-app-capable", content: "yes" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "default",
        },
        { name: "apple-mobile-web-app-title", content: "My Finances" },
        { name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
        {
          name: "theme-color",
          content: "#0a0a0a",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/manifest.webmanifest" },
      ],
    },
  },
});
