export function useSiteOrigin() {
  const config = useRuntimeConfig();
  const requestURL = useRequestURL();

  function resolveSiteOrigin(): string | undefined {
    const fromEnv = config.public.NUXT_PUBLIC_SITE_URL?.trim();
    if (fromEnv) return fromEnv.replace(/\/+$/, "");

    if (import.meta.client && typeof window !== "undefined") {
      return window.location.origin;
    }

    const reqOrigin = requestURL.origin;
    return reqOrigin || undefined;
  }

  return { resolveSiteOrigin };
}
