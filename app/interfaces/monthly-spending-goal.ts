export interface MonthlySpendingGoalPayload {
  month: string;
  goal: { id: string; amount: number } | null;
  spent: number;
}
