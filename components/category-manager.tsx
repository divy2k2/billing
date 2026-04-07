"use client";

import { useState } from "react";
import { useToast } from "@/components/toast-provider";
import type { Category, EntryType } from "@/lib/types";

const palette = ["#0f766e", "#15803d", "#2563eb", "#9333ea", "#ea580c", "#dc2626"];

export function CategoryManager({ categories }: { categories: Category[] }) {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [type, setType] = useState<EntryType>("expense");
  const [color, setColor] = useState(palette[0]);
  const [status, setStatus] = useState("Need a new category? Add it here.");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("Creating category...");

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, type, color })
    });

    const payload = await response.json();

    if (!response.ok) {
      const nextMessage = payload.error ?? "Could not create category.";
      setStatus(nextMessage);
      showToast(nextMessage, "error");
      setSubmitting(false);
      return;
    }

    setStatus("Category created. Refreshing dashboard...");
    showToast("Category created successfully.");
    window.location.reload();
  }

  async function handleDelete(category: Category) {
    setDeletingId(category.id);

    const response = await fetch(`/api/categories/${category.id}`, {
      method: "DELETE"
    });

    const payload = await response.json();

    if (!response.ok) {
      showToast(payload.error ?? "Could not delete category.", "error");
      setDeletingId(null);
      return;
    }

    showToast(`Category "${category.name}" deleted successfully.`);
    window.location.reload();
  }

  return (
    <section className="spotlight">
      <div className="toolbar">
        <h2>Category Manager</h2>
        <span className="muted">Income and expense groups</span>
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="category-name">Name</label>
            <input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Freelance, Fuel, Rent..."
              required
            />
          </div>
          <div className="field">
            <label htmlFor="category-type">Type</label>
            <select
              id="category-type"
              value={type}
              onChange={(event) => setType(event.target.value as EntryType)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="field full">
            <label htmlFor="category-color">Color</label>
            <div className="color-picker-row">
              <span className="color-preview" style={{ background: color }} aria-hidden="true" />
              <select
                id="category-color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
              >
                {palette.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create category"}
        </button>
        <p className="status">{status}</p>
      </form>
      <div className="category-list">
        {categories.map((category) => (
          <div className="category-row" key={category.id}>
            <span className="category-pill">
              <span className="dot" style={{ background: category.color }} />
              {category.name} · {category.type}
            </span>
            <button
              className="button ghost"
              type="button"
              onClick={() => handleDelete(category)}
              disabled={deletingId === category.id}
            >
              {deletingId === category.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
