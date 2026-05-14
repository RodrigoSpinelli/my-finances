export interface DashboardBalance {
  month: string;
  /** Líquido do mês selecionado (entradas − saídas somente no período). */
  month_balance: number;
  /** Saldo acumulado até o último dia do mês selecionado. */
  accumulated_balance: number;
  /**
   * Líquido do mês anterior ao selecionado (o que sobrou naquele mês,
   * não o patrimônio acumulado desde o início).
   */
  previous_month_balance: number;
  /** Variação % do líquido mensal vs o líquido do mês anterior. */
  month_change_percent: number | null;
  /**
   * Variação % do líquido do mês anterior vs o líquido do mês retrasado
   * (mesma lógica do “Saldo atual”, deslocada um mês).
   */
  previous_month_change_percent: number | null;
  /**
   * Variação % do patrimônio acumulado (fim do mês anterior → fim do mês atual).
   */
  accumulated_change_percent: number | null;
}
