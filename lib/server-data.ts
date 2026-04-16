import { getAdminEmail } from "@/lib/admin";
import { getAdminSession } from "@/lib/session";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { Category, DashboardSummary, Entry } from "@/lib/types";
import { dayLabel, isoDate, parseIsoDate } from "@/lib/utils";

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
  const now = parseIsoDate(isoDate());
  const thisMonthKey = isoDate().slice(0, 7);
  const dayMs = 24 * 60 * 60 * 1000;
  const currentWeekStart = new Date(now.getTime() - 6 * dayMs);
  const previousWeekStart = new Date(now.getTime() - 13 * dayMs);
  const previousWeekEnd = new Date(now.getTime() - 7 * dayMs);

  const summary = entries.reduce(
    (acc, entry) => {
      const amount = normalizeMoney(entry.amount);

      if (entry.type === "income") {
        acc.income += amount;
      } else {
        acc.expense += amount;
      }

      const month = entry.occurred_on.slice(0, 7);
      const monthRow = acc.monthlyMap.get(month) ?? {
        month,
        income: 0,
        expense: 0
      };

      if (entry.type === "income") {
        monthRow.income += amount;
      } else {
        monthRow.expense += amount;
      }

      acc.monthlyMap.set(month, monthRow);

      if (month === thisMonthKey) {
        if (entry.type === "income") {
          acc.monthlyIncome += amount;
        } else {
          acc.monthlyExpense += amount;
        }
      }

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

      categoryRow.total += amount;
      acc.categoryMap.set(categoryKey, categoryRow);

      const entryDate = parseIsoDate(entry.occurred_on);
      const entryTime = entryDate.getTime();
      if (entryTime >= currentWeekStart.getTime() && entryTime <= now.getTime()) {
        const dayKey = entry.occurred_on;
        const dayRow = acc.currentWeekMap.get(dayKey) ?? { income: 0, expense: 0 };
        dayRow[entry.type] += amount;
        acc.currentWeekMap.set(dayKey, dayRow);
        acc.weekComparison[entry.type === "income" ? "currentIncome" : "currentExpense"] += amount;
      } else if (
        entryTime >= previousWeekStart.getTime() &&
        entryTime <= previousWeekEnd.getTime()
      ) {
        const dayKey = entry.occurred_on;
        const dayRow = acc.previousWeekMap.get(dayKey) ?? { income: 0, expense: 0 };
        dayRow[entry.type] += amount;
        acc.previousWeekMap.set(dayKey, dayRow);
        acc.weekComparison[entry.type === "income" ? "previousIncome" : "previousExpense"] += amount;
      }

      return acc;
    },
    {
      income: 0,
      expense: 0,
      monthlyIncome: 0,
      monthlyExpense: 0,
      monthlyMap: new Map<string, { month: string; income: number; expense: number }>(),
      currentWeekMap: new Map<string, { income: number; expense: number }>(),
      previousWeekMap: new Map<string, { income: number; expense: number }>(),
      weekComparison: {
        currentIncome: 0,
        currentExpense: 0,
        previousIncome: 0,
        previousExpense: 0
      },
      categoryMap: new Map<
        string,
        { category: string; total: number; type: "income" | "expense"; color: string }
      >()
    }
  );

  const weeklyTrend = Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(currentWeekStart.getTime() + index * dayMs);
    const previousDate = new Date(previousWeekStart.getTime() + index * dayMs);
    const currentKey = isoDate(currentDate);
    const previousKey = isoDate(previousDate);
    const currentDay = summary.currentWeekMap.get(currentKey) ?? { income: 0, expense: 0 };
    const previousDay = summary.previousWeekMap.get(previousKey) ?? { income: 0, expense: 0 };

    return {
      date: currentKey,
      label: dayLabel(currentKey),
      currentNet: currentDay.income - currentDay.expense,
      previousNet: previousDay.income - previousDay.expense
    };
  });

  const dashboardSummary: DashboardSummary = {
    income: summary.income,
    expense: summary.expense,
    balance: summary.income - summary.expense,
    monthlyIncome: summary.monthlyIncome,
    monthlyExpense: summary.monthlyExpense,
    savingsRate:
      summary.income === 0
        ? 0
        : Number((((summary.income - summary.expense) / summary.income) * 100).toFixed(1)),
    monthly: [...summary.monthlyMap.values()].sort((a, b) => a.month.localeCompare(b.month)),
    weeklyTrend,
    weekComparison: summary.weekComparison,
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
