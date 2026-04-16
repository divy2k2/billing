"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/toast-provider";
import type { Category, EntryType } from "@/lib/types";
import { isoDate } from "@/lib/utils";

export function EntryForm({ categories }: { categories: Category[] }) {
  const { showToast } = useToast();
  const [type, setType] = useState<EntryType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [occurredOn, setOccurredOn] = useState(isoDate());
  const [categoryId, setCategoryId] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Create a new financial record.");
  const [submitting, setSubmitting] = useState(false);
  const numericAmount = Number(amount) || 0;

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type]
  );
  const gst = numericAmount * 0.18;
  const vat = numericAmount * 0.05;
  const totalWithGst = numericAmount + gst;
  const totalWithVat = numericAmount + vat;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("Saving your record...");

    const response = await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        amount: Number(amount),
        type,
        occurred_on: occurredOn,
        category_id: categoryId,
        notes
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      const nextMessage = payload.error ?? "We couldn't save this record.";
      setStatus(nextMessage);
      showToast(nextMessage, "error");
      setSubmitting(false);
      return;
    }

    setStatus("Record saved. Refreshing your workspace...");
    showToast("Record saved successfully.");
    window.location.reload();
  }

  return (
    <section className="entry-form" id="new-entry">
      <div className="toolbar">
        <div>
          <h2>Create Record</h2>
          <span className="muted">Capture a new transaction with a live tax preview</span>
        </div>
        <span className="type-pill">{type === "income" ? "Revenue entry" : "Expense entry"}</span>
      </div>
      <div className="entry-form-layout">
        <form className="stack" onSubmit={handleSubmit}>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="type">Record type</label>
              <select
                id="type"
                value={type}
                onChange={(event) => {
                  setType(event.target.value as EntryType);
                  setCategoryId("");
                }}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="1250.00"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={type === "income" ? "Client payment" : "Studio rent"}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="occurred-on">Transaction date</label>
              <input
                id="occurred-on"
                type="date"
                value={occurredOn}
                onChange={(event) => setOccurredOn(event.target.value)}
                required
              />
            </div>
            <div className="field full">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
              >
                <option value="">Choose a category</option>
                {filteredCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field full">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional context, invoice number, or payment reference..."
              />
            </div>
          </div>
          <button className="button primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save record"}
          </button>
          <p className="status">{status}</p>
        </form>
        <aside className="tax-panel">
          <div className="toolbar">
            <h3>Tax Breakdown</h3>
            <span className="muted">Live preview</span>
          </div>
          <div className="tax-stack">
            <div className="tax-row">
              <span>Base amount</span>
              <strong>{numericAmount.toFixed(2)}</strong>
            </div>
            <div className="tax-row">
              <span>GST @ 18%</span>
              <strong>{gst.toFixed(2)}</strong>
            </div>
            <div className="tax-row">
              <span>Total including GST</span>
              <strong>{totalWithGst.toFixed(2)}</strong>
            </div>
            <div className="tax-row">
              <span>VAT @ 5%</span>
              <strong>{vat.toFixed(2)}</strong>
            </div>
            <div className="tax-row">
              <span>Total including VAT</span>
              <strong>{totalWithVat.toFixed(2)}</strong>
            </div>
          </div>
          <p className="muted tax-note">
            This is a preview only. The saved amount remains exactly as entered, so you can record either net or gross values intentionally.
          </p>
        </aside>
      </div>
    </section>
  );
}
