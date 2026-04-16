"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/toast-provider";
import type { Entry } from "@/lib/types";
import { currency } from "@/lib/utils";

function entryCategory(entry: Entry) {
  if (Array.isArray(entry.category)) {
    return entry.category[0];
  }

  return entry.category ?? undefined;
}

export function EntriesTable({ entries }: { entries: Entry[] }) {
  const { showToast } = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return entries;
    }

    return entries.filter((entry) => {
      const category = entryCategory(entry);
      const haystack = [entry.title, entry.notes, category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [entries, query]);

  async function handleDelete(id: string) {
    setBusyId(id);
    const response = await fetch(`/api/entries/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      showToast("Entry removed successfully.");
      window.location.reload();
      return;
    }

    showToast("We couldn't remove that entry.", "error");
    setBusyId(null);
  }

  return (
    <section className="table-card">
      <div className="toolbar table-toolbar">
        <div>
          <h2>Activity Ledger</h2>
          <span className="muted">A compact, searchable view of your recent records</span>
        </div>
        <div className="ledger-search">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, notes, or category"
            aria-label="Search activity ledger"
          />
          <span className="result-count">{filteredEntries.length} record(s)</span>
        </div>
      </div>
      <div className="table-wrap">
        <table className="compact-table">
          <thead>
            <tr>
              <th>Entry</th>
              <th>Direction</th>
              <th>Category</th>
              <th>Date</th>
              <th>Value</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted">
                  No matching records yet. Add a new entry or refine your search terms.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                (() => {
                  const category = entryCategory(entry);
                  const categoryName = category?.name ?? "Uncategorized";
                  const categoryTone = categoryName.toLowerCase().includes("service")
                    ? "service"
                    : categoryName.toLowerCase().includes("product")
                      ? "product"
                      : categoryName.toLowerCase().includes("payment")
                        ? "payment"
                        : "default";

                  return (
                    <tr key={entry.id}>
                      <td>
                        <strong>{entry.title}</strong>
                        <div className="muted">{entry.notes || "No additional notes"}</div>
                      </td>
                      <td>
                        <span className={`type-pill ${entry.type}`}>
                          {entry.type === "income" ? "Credit" : "Debit"}
                        </span>
                      </td>
                      <td>
                        <span className={`category-pill category-${categoryTone}`}>
                          <span
                            className="dot"
                            style={{ background: category?.color ?? "#94a3b8" }}
                          />
                          {categoryName}
                        </span>
                      </td>
                      <td>{entry.occurred_on}</td>
                      <td className={entry.type}>{currency(Number(entry.amount))}</td>
                      <td>
                        <button
                          className="button ghost"
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          disabled={busyId === entry.id}
                        >
                          {busyId === entry.id ? "Removing..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })()
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
