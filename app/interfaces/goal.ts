export interface GoalPayload {
  month: string;
  goal: {
    id: string;
    amount: number;
  } | null;
  spent: number;
}
