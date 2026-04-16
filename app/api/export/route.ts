import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server-data";
import type { Entry } from "@/lib/types";

export const dynamic = "force-dynamic";

function normalizeCategory(entry: Entry) {
  if (Array.isArray(entry.category)) {
    return entry.category[0];
  }

  return entry.category ?? undefined;
}

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1))}...`;
}

function buildPdf(entries: Entry[]) {
  const lines = [
    "Lilavanti Enterprise Billing History",
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    "",
    ...entries.map((entry) => {
      const category = normalizeCategory(entry);
      const row = [
        entry.occurred_on,
        entry.type.toUpperCase(),
        category?.name ?? "Uncategorized",
        `INR ${Number(entry.amount).toFixed(2)}`,
        entry.title,
        entry.notes ?? ""
      ].join(" | ");

      return truncate(row, 108);
    })
  ];

  const pageHeight = 792;
  const top = 752;
  const lineHeight = 16;
  const linesPerPage = 42;
  const pages = [];

  for (let index = 0; index < lines.length; index += linesPerPage) {
    pages.push(lines.slice(index, index + linesPerPage));
  }

  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");

  const pageObjectNumbers = pages.map((_, index) => 4 + index * 2);
  const kids = pageObjectNumbers.map((number) => `${number} 0 R`).join(" ");
  objects.push(`<< /Type /Pages /Count ${pages.length} /Kids [${kids}] >>`);
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  pages.forEach((pageLines, pageIndex) => {
    const pageObjectNumber = pageObjectNumbers[pageIndex];
    const contentObjectNumber = pageObjectNumber + 1;
    const content = [
      "BT",
      "/F1 11 Tf",
      `1 0 0 1 48 ${top} Tm`,
      `${lineHeight} TL`,
      ...pageLines.flatMap((line, lineIndex) => (
        lineIndex === 0
          ? [`(${escapePdfText(line)}) Tj`]
          : ["T*", `(${escapePdfText(line)}) Tj`]
      )),
      "ET"
    ].join("\n");

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 ${pageHeight}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`
    );
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

export async function GET() {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
      .from("entries")
      .select("id,title,notes,amount,type,occurred_on,created_at,category:categories(name)")
      .order("occurred_on", { ascending: false });

    if (error) {
      throw error;
    }

    const rows = (data ?? []) as Entry[];
    const pdf = buildPdf(rows);
    const filename = `billing-history-${new Date().toISOString().slice(0, 10)}.pdf`;

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Could not export billing history." }, { status: 500 });
  }
}
