"use client";

import { useState } from "react";
import type { Entry } from "@/lib/types";
import { currency } from "@/lib/utils";

function entryCategory(entry: Entry) {
  if (Array.isArray(entry.category)) {
    return entry.category[0];
  }

  return entry.category ?? undefined;
}

export function EntriesTable({ entries }: { entries: Entry[] }) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setBusyId(id);
    const response = await fetch(`/api/entries/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      window.location.reload();
      return;
    }

    setBusyId(null);
  }

  return (
    <section className="table-card">
      <div className="toolbar">
        <h2>Recent Transactions</h2>
        <span className="muted">{entries.length} latest rows</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted">
                  No transactions yet. Add your first income or expense on the right.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                (() => {
                  const category = entryCategory(entry);

                  return (
                    <tr key={entry.id}>
                      <td>
                        <strong>{entry.title}</strong>
                        <div className="muted">{entry.notes || "No notes"}</div>
                      </td>
                      <td>
                        <span className={`type-pill ${entry.type}`}>
                          {entry.type === "income" ? "Incoming" : "Outgoing"}
                        </span>
                      </td>
                      <td>
                        <span className="category-pill">
                          <span
                            className="dot"
                            style={{ background: category?.color ?? "#94a3b8" }}
                          />
                          {category?.name ?? "Uncategorized"}
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
                          {busyId === entry.id ? "Deleting..." : "Delete"}
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
