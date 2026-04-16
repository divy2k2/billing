import type { DashboardSummary } from "@/lib/types";
import { currency } from "@/lib/utils";

function createPath(values: number[], width: number, height: number) {
  if (values.length === 0) {
    return "";
  }

  const maxAbs = Math.max(1, ...values.map((value) => Math.abs(value)));

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - ((value + maxAbs) / (maxAbs * 2)) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function TrendLineCard({ summary }: { summary: DashboardSummary }) {
  const currentValues = summary.weeklyTrend.map((point) => point.currentNet);
  const previousValues = summary.weeklyTrend.map((point) => point.previousNet);
  const currentPath = createPath(currentValues, 100, 56);
  const previousPath = createPath(previousValues, 100, 56);
  const currentNet = summary.weekComparison.currentIncome - summary.weekComparison.currentExpense;
  const previousNet = summary.weekComparison.previousIncome - summary.weekComparison.previousExpense;

  return (
    <section className="spotlight trend-card">
      <div className="toolbar">
        <div>
          <h2>Weekly Trend</h2>
          <p className="muted">This week vs. last week net movement</p>
        </div>
        <span className="trend-pill">
          {currentNet >= previousNet ? "Ahead" : "Behind"} {currency(Math.abs(currentNet - previousNet))}
        </span>
      </div>
      <div className="trend-chart">
        <svg viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true">
          <path d={previousPath} className="trend-line previous" />
          <path d={currentPath} className="trend-line current" />
        </svg>
        <div className="trend-labels">
          {summary.weeklyTrend.map((point) => (
            <span key={point.date}>{point.label}</span>
          ))}
        </div>
      </div>
      <div className="trend-meta">
        <article>
          <small>This week</small>
          <strong>{currency(currentNet)}</strong>
          <span className="muted">
            In {currency(summary.weekComparison.currentIncome)} / Out {currency(summary.weekComparison.currentExpense)}
          </span>
        </article>
        <article>
          <small>Last week</small>
          <strong>{currency(previousNet)}</strong>
          <span className="muted">
            In {currency(summary.weekComparison.previousIncome)} / Out {currency(summary.weekComparison.previousExpense)}
          </span>
        </article>
      </div>
    </section>
  );
}
