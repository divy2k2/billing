"use client";

import { useState } from "react";
import { CategoryManager } from "@/components/category-manager";
import { useToast } from "@/components/toast-provider";
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
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function signOut() {
    setRefreshing(true);
    const response = await fetch("/api/summary", {
      method: "DELETE"
    });

    if (!response.ok) {
      showToast("We couldn't sign you out.", "error");
      setRefreshing(false);
      return;
    }

    showToast("You have been signed out.");
    window.location.href = "/auth";
  }

  function refreshPage() {
    setRefreshing(true);
    window.location.reload();
  }

  async function exportPdf() {
    setExporting(true);
    const response = await fetch("/api/export");

    if (!response.ok) {
      showToast("We couldn't export your records.", "error");
      setExporting(false);
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `billing-history-${new Date().toISOString().slice(0, 10)}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    showToast("Your PDF export is ready.");
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Lilavanti Enterprise</p>
          <h1>Finance Command Center.</h1>
          <p className="muted">
            Signed in as {initialData.user.email ?? "your account"} with a secure administrator session.
          </p>
        </div>
        <div className="hero-actions">
          <button className="button secondary" onClick={exportPdf} disabled={exporting}>
            {exporting ? "Preparing PDF..." : "Download PDF"}
          </button>
          <button className="button ghost" onClick={refreshPage} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button className="button secondary" onClick={signOut} disabled={refreshing}>
            Log out
          </button>
        </div>
      </section>

      <div className="bento-grid">
        <div className="grid-full"><SummaryCards summary={initialData.summary} /></div>
        <div className="grid-full"><EntriesTable entries={initialData.entries} /></div>
        <div className="grid-half"><EntryForm categories={initialData.categories} /></div>
        <div className="grid-half"><CategoryManager categories={initialData.categories} /></div>
        <div className="grid-half"><MonthlyOverview summary={initialData.summary} /></div>
        <div className="grid-half"><TopCategories summary={initialData.summary} /></div>
      </div>

      <a className="fab" href="#new-entry" aria-label="Create a new entry">
        Add Record
      </a>
    </main>
  );
}
