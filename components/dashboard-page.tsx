"use client";

import { useState } from "react";
import { CategoryManager } from "@/components/category-manager";
import { EntryForm } from "@/components/entry-form";
import { EntriesTable } from "@/components/entries-table";
import { MonthlyOverview } from "@/components/monthly-overview";
import { SummaryCards } from "@/components/summary-cards";
import { TopCategories } from "@/components/top-categories";
import type { Category, DashboardSummary, Entry } from "@/lib/types";

type DashboardPageProps = {
  initialData: {
    user: {
      email?: string | null;
    };
    entries: Entry[];
    categories: Category[];
    summary: DashboardSummary;
  };
};

export function DashboardPage({ initialData }: DashboardPageProps) {
  const [refreshing, setRefreshing] = useState(false);

  async function signOut() {
    setRefreshing(true);
    await fetch("/api/summary", {
      method: "DELETE"
    });
    window.location.href = "/auth";
  }

  function refreshPage() {
    setRefreshing(true);
    window.location.reload();
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Lilavati Enterprise</p>
          <h1>Financial Dashboard.</h1>
          <p className="muted">
            Logged in as {initialData.user.email ?? "your account"} with the private admin session.
          </p>
        </div>
        <div className="hero-actions">
          <button className="button ghost" onClick={refreshPage} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh data"}
          </button>
          <button className="button secondary" onClick={signOut} disabled={refreshing}>
            Sign out
          </button>
        </div>
      </section>

      <div className="bento-grid">
        <div className="grid-full"><SummaryCards summary={initialData.summary} /></div>
        <div className="grid-half"><EntryForm categories={initialData.categories} /></div>
        <div className="grid-half"><CategoryManager /></div>
        <div className="grid-full"><EntriesTable entries={initialData.entries} /></div>
        <div className="grid-half"><MonthlyOverview summary={initialData.summary} /></div>
        <div className="grid-half"><TopCategories summary={initialData.summary} /></div>
      </div>
    </main>
  );
}
