import type { DashboardSummary } from "@/lib/types";
import { currency, monthLabel } from "@/lib/utils";

export function MonthlyOverview({ summary }: { summary: DashboardSummary }) {
  const maxValue = Math.max(
    1,
    ...summary.monthly.flatMap((item) => [item.income, item.expense])
  );

  return (
    <section className="spotlight">
      <div className="toolbar">
        <h2>Monthly Performance</h2>
        <span className="muted">{summary.monthly.length} month(s) tracked</span>
      </div>
      <div className="chart">
        {summary.monthly.length === 0 ? (
          <p className="muted">Add your first records to unlock monthly performance trends.</p>
        ) : (
          summary.monthly.map((item) => (
            <div className="chart-row" key={item.month}>
              <div className="chart-labels">
                <strong>{monthLabel(item.month)}</strong>
                <span className="muted">
                  {currency(item.income)} / {currency(item.expense)}
                </span>
              </div>
              <div className="track">
                <div
                  className="bar income"
                  style={{ width: `${(item.income / maxValue) * 100}%` }}
                />
                <div
                  className="bar expense"
                  style={{ width: `${(item.expense / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
