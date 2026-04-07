"use client";

import { useMemo, useState } from "react";
import type { Category, EntryType } from "@/lib/types";
import { isoDate } from "@/lib/utils";

export function EntryForm({ categories }: { categories: Category[] }) {
  const [type, setType] = useState<EntryType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [occurredOn, setOccurredOn] = useState(isoDate());
  const [categoryId, setCategoryId] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Add a new income or expense entry.");
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("Saving transaction...");

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
      setStatus(payload.error ?? "Could not save the transaction.");
      setSubmitting(false);
      return;
    }

    setStatus("Transaction saved. Refreshing dashboard...");
    window.location.reload();
  }

  return (
    <section className="entry-form">
      <div className="toolbar">
        <h2>New Transaction</h2>
        <span className="muted">Serverless save</span>
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="type">Entry type</label>
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
              placeholder={type === "income" ? "Salary" : "Office rent"}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="occurred-on">Date</label>
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
              <option value="">Select a category</option>
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
              placeholder="Optional description, invoice number, bank transfer note..."
            />
          </div>
        </div>
        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save transaction"}
        </button>
        <p className="status">{status}</p>
      </form>
    </section>
  );
}
