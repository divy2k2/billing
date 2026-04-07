import { currency } from "@/lib/utils";
import type { DashboardSummary } from "@/lib/types";

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  return (
    <section className="card-grid">
      <article className="summary-card">
        <p>Total Income</p>
        <strong className="income">{currency(summary.income)}</strong>
        <small>All incoming amounts recorded in your account.</small>
      </article>
      <article className="summary-card">
        <p>Total Expense</p>
        <strong className="expense">{currency(summary.expense)}</strong>
        <small>All outgoing amounts across every category.</small>
      </article>
      <article className="summary-card">
        <p>Current Balance</p>
        <strong>{currency(summary.balance)}</strong>
        <small>Savings rate: {summary.savingsRate}%</small>
      </article>
    </section>
  );
}
