export interface DashboardMonthOption {
  value: string;
  label: string;
}

function toYearMonthKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

const monthLabelFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

function buildMonthOptions(createdAtIso: string | null): DashboardMonthOption[] {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  const registered = createdAtIso ? new Date(createdAtIso) : null;
  let start = registered
    ? new Date(registered.getFullYear(), registered.getMonth(), 1)
    : new Date(end);
  if (start > end) start = new Date(end);

  const options: DashboardMonthOption[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    options.push({
      value: toYearMonthKey(cursor),
      label: monthLabelFormatter.format(cursor),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return options;
}

export async function useDashboardMonthSelect() {
  const supabase = useSupabaseClient();

  const { data: authUser } = await useAsyncData(
    "dashboard-auth-user-full",
    async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return null;
      return data.user;
    },
  );

  const registrationCreatedAt = computed(() => authUser.value?.created_at ?? null);

  const monthOptions = computed(() =>
    buildMonthOptions(registrationCreatedAt.value),
  );

  const month = ref(toYearMonthKey(new Date()));

  watch(
    monthOptions,
    (opts) => {
      if (!opts.some((o) => o.value === month.value))
        month.value = opts[opts.length - 1]!.value;
    },
    { immediate: true },
  );

  return {
    month,
    monthOptions,
  };
}
