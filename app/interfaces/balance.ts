export interface DashboardBalance {
  month: string;
  current_balance: number;
  previous_balance: number;
  current_change_percent: number | null;
  previous_change_percent: number | null;
}
