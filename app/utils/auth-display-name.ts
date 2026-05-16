/** JWT `user_metadata` de signup + provedores OAuth (Google, GitHub, etc.). */
export type AuthUserLike =
  | {
      email?: string | null;
      user_metadata?: Record<string, unknown> | null;
    }
  | null
  | undefined;

const META_NAME_KEYS = [
  "display_name",
  "full_name",
  "name",
  "preferred_username",
  "user_name",
] as const;

const META_AVATAR_URL_KEYS = ["picture", "avatar_url", "image"] as const;

export function resolveAuthAvatarUrl(user: AuthUserLike): string | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  for (const key of META_AVATAR_URL_KEYS) {
    const raw = meta[key];
    if (typeof raw !== "string") continue;
    const t = raw.trim();
    if (!t) continue;
    if (t.startsWith("https://") || t.startsWith("http://")) return t;
    if (t.startsWith("//")) return `https:${t}`;
  }
  return null;
}

/** Primeiro texto útil pra exibir nome / iniciais. */
export function resolveAuthDisplayName(user: AuthUserLike): string | null {
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  const given =
    typeof meta.given_name === "string" ? meta.given_name.trim() : "";
  const family =
    typeof meta.family_name === "string" ? meta.family_name.trim() : "";
  if (given && family) return `${given} ${family}`;
  if (given) return given;
  if (family) return family;

  for (const key of META_NAME_KEYS) {
    const raw = meta[key];
    if (typeof raw !== "string") continue;
    const t = raw.trim();
    if (t.length > 0) return t;
  }
  const email = typeof user.email === "string" ? user.email.trim() : "";
  if (!email) return null;
  const local = email.split("@")[0]?.trim();
  return local?.length ? local : null;
}

export function resolveAuthDisplayFallback(user: AuthUserLike): string {
  return resolveAuthDisplayName(user)?.trim() || "Usuário";
}

export function initialsFromDisplayString(display: string): string {
  const words = display.split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  if (words.length === 1) {
    const ch = words[0]?.[0];
    return ch ? ch.toUpperCase() : "";
  }
  const first = words[0]?.[0];
  const last = words[words.length - 1]?.[0];
  return (first ? first.toUpperCase() : "") + (last ? last.toUpperCase() : "");
}

export function initialsFromAuthUser(user: AuthUserLike): string {
  const fromMeta = resolveAuthDisplayName(user);
  if (fromMeta) return initialsFromDisplayString(fromMeta);

  const email = typeof user?.email === "string" ? user.email : "";
  if (!email) return "";

  const namePart = email.split("@")[0] ?? "";
  const emailWords = namePart.split(/[.\-_]/).filter(Boolean);
  if (emailWords.length > 1) {
    const first = emailWords[0]?.[0];
    const last = emailWords[emailWords.length - 1]?.[0];
    return (first ? first.toUpperCase() : "") + (last ? last.toUpperCase() : "");
  }
  const ch = namePart[0];
  return ch ? ch.toUpperCase() : "";
}
