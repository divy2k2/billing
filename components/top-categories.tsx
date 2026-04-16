import type { DashboardSummary } from "@/lib/types";
import { currency } from "@/lib/utils";

export function TopCategories({ summary }: { summary: DashboardSummary }) {
  const maxValue = Math.max(1, ...summary.byCategory.map((item) => item.total));

  return (
    <section className="spotlight">
      <div className="toolbar">
        <h2>Category Insights</h2>
        <span className="muted">{summary.byCategory.length} categories tracked</span>
      </div>
      <div className="split-bars">
        {summary.byCategory.length === 0 ? (
          <p className="muted">Create categories and add records to reveal spending and revenue patterns.</p>
        ) : (
          summary.byCategory.slice(0, 8).map((item) => (
            <div className="split-row" key={`${item.type}-${item.category}`}>
              <div className="split-meta">
                <span>
                  {item.category} · <span className={item.type}>{item.type}</span>
                </span>
                <strong>{currency(item.total)}</strong>
              </div>
              <div className="split-track">
                <div
                  className="split-fill"
                  style={{
                    width: `${(item.total / maxValue) * 100}%`,
                    background: item.color
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
