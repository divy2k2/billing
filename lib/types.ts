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
  monthly: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
  byCategory: Array<{
    category: string;
    total: number;
    type: EntryType;
    color: string;
  }>;
};
