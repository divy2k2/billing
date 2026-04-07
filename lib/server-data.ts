import { getAdminEmail } from "@/lib/admin";
import { getAdminSession } from "@/lib/session";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { Category, DashboardSummary, Entry } from "@/lib/types";

function normalizeMoney(value: number | string | null) {
  return Number(value ?? 0);
}

function normalizeCategory(entry: Entry) {
  const category = entry.category;

  if (Array.isArray(category)) {
    return category[0];
  }

  return category ?? undefined;
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const supabase = createSupabaseAdminClient();
  return { supabase };
}

export async function getCurrentUser() {
  const session = await getAdminSession();
  return session ? { email: getAdminEmail() } : null;
}

export async function fetchDashboardData() {
  const { supabase } = await requireAdmin();

  const [entriesResponse, categoriesResponse] = await Promise.all([
    supabase
      .from("entries")
      .select("id,title,notes,amount,type,occurred_on,category_id,created_at,category:categories(id,name,type,color)")
      .order("occurred_on", { ascending: false })
      .limit(50),
    supabase
      .from("categories")
      .select("id,name,type,color,created_at")
      .order("name")
  ]);

  if (entriesResponse.error) {
    throw entriesResponse.error;
  }

  if (categoriesResponse.error) {
    throw categoriesResponse.error;
  }

  const entries = (entriesResponse.data ?? []) as Entry[];
  const categories = (categoriesResponse.data ?? []) as Category[];

  const summary = entries.reduce(
    (acc, entry) => {
      if (entry.type === "income") {
        acc.income += normalizeMoney(entry.amount);
      } else {
        acc.expense += normalizeMoney(entry.amount);
      }

      const month = entry.occurred_on.slice(0, 7);
      const monthRow = acc.monthlyMap.get(month) ?? {
        month,
        income: 0,
        expense: 0
      };

      if (entry.type === "income") {
        monthRow.income += normalizeMoney(entry.amount);
      } else {
        monthRow.expense += normalizeMoney(entry.amount);
      }

      acc.monthlyMap.set(month, monthRow);

      const category = normalizeCategory(entry);
      const categoryName = category?.name ?? "Uncategorized";
      const categoryColor = category?.color ?? "#64748b";
      const categoryKey = `${entry.type}:${categoryName}`;
      const categoryRow = acc.categoryMap.get(categoryKey) ?? {
        category: categoryName,
        total: 0,
        type: entry.type,
        color: categoryColor
      };

      categoryRow.total += normalizeMoney(entry.amount);
      acc.categoryMap.set(categoryKey, categoryRow);

      return acc;
    },
    {
      income: 0,
      expense: 0,
      monthlyMap: new Map<string, { month: string; income: number; expense: number }>(),
      categoryMap: new Map<
        string,
        { category: string; total: number; type: "income" | "expense"; color: string }
      >()
    }
  );

  const dashboardSummary: DashboardSummary = {
    income: summary.income,
    expense: summary.expense,
    balance: summary.income - summary.expense,
    savingsRate:
      summary.income === 0
        ? 0
        : Number((((summary.income - summary.expense) / summary.income) * 100).toFixed(1)),
    monthly: [...summary.monthlyMap.values()].sort((a, b) => a.month.localeCompare(b.month)),
    byCategory: [...summary.categoryMap.values()].sort((a, b) => b.total - a.total)
  };

  return {
    user: {
      email: getAdminEmail()
    },
    entries,
    categories,
    summary: dashboardSummary
  };
}
