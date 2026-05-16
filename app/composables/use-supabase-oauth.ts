export type OAuthProviderId = "google" | "github";

export function useSupabaseOAuth() {
  const supabase = useSupabaseClient();
  const { resolveSiteOrigin } = useSiteOrigin();

  async function signInWithOAuthProvider(
    provider: OAuthProviderId,
  ): Promise<{ ok: boolean }> {
    const origin = resolveSiteOrigin();
    const redirectTo = origin ? `${origin}/confirm` : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        ...(redirectTo ? { redirectTo } : {}),
      },
    });

    if (error) {
      useToast({
        type: "error",
        title: "Não foi possível continuar",
        description: error.message,
      });
      return { ok: false };
    }

    return { ok: true };
  }

  return { signInWithOAuthProvider };
}
