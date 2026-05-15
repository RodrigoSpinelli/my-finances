export interface DashboardBalance {
  month: string;
  /** Líquido do mês selecionado (entradas − saídas somente no período). */
  month_balance: number;
  /**
   * Líquido do mês anterior ao selecionado (entradas − saídas naquele período).
   */
  previous_month_balance: number;
  /** Variação % do líquido mensal vs o líquido do mês anterior. */
  month_change_percent: number | null;
}
