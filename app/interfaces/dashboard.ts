export interface ExpenseDailyRow {
  date: string;
  amount: number;
}

export interface ExpenseDailyResponse {
  month: string;
  daily: ExpenseDailyRow[];
  month_total: number;
}

export interface MonthFlowResponse {
  month: string;
  income_total: number;
  expense_total: number;
}

export interface ItemsData {
  category_id: string;
  name: string;
  icon: string;
  type: TransactionType;
  color: string | null;
  color_hex: string;
  transaction_count: number;
  total_amount: number;
  percentage: number;
}

export interface CategoryData {
  month: string;
  type: TransactionType | "all";
  items: ItemsData[];
}
