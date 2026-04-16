import { currency } from "@/lib/utils";
import type { DashboardSummary } from "@/lib/types";

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  return (
    <section className="card-grid">
      <article className="summary-card">
        <p>Net Position</p>
        <strong className={summary.balance >= 0 ? "income" : "expense"}>{currency(summary.balance)}</strong>
        <small>Retention rate: {summary.savingsRate}%</small>
      </article>
      <article className="summary-card">
        <p>Monthly Revenue</p>
        <strong className="income">{currency(summary.monthlyIncome)}</strong>
        <small>Total inflow recorded this month.</small>
      </article>
      <article className="summary-card">
        <p>Monthly Spend</p>
        <strong className="expense">{currency(summary.monthlyExpense)}</strong>
        <small>Total outflow recorded this month.</small>
      </article>
    </section>
  );
}
