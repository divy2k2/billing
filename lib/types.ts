export type EntryType = "income" | "expense";

export type Category = {
  id: string;
  name: string;
  type: EntryType;
  color: string;
  created_at?: string;
  user_id?: string;
};

export type Entry = {
  id: string;
  title: string;
  notes: string | null;
  amount: number;
  gst_rate?: number;
  type: EntryType;
  occurred_on: string;
  category_id: string;
  created_at?: string;
  user_id?: string;
  category?: Category | Category[] | null;
};

export type DashboardSummary = {
  income: number;
  expense: number;
  balance: number;
  savingsRate: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthly: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
  weeklyTrend: Array<{
    date: string;
    label: string;
    currentNet: number;
    previousNet: number;
  }>;
  weekComparison: {
    currentIncome: number;
    currentExpense: number;
    previousIncome: number;
    previousExpense: number;
  };
  byCategory: Array<{
    category: string;
    total: number;
    type: EntryType;
    color: string;
  }>;
};
