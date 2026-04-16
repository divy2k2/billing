import { NextResponse } from "next/server";
import { getCompanyProfile } from "@/lib/env";
import { requireAdmin } from "@/lib/server-data";
import type { Entry } from "@/lib/types";

export const dynamic = "force-dynamic";

type Rgb = [number, number, number];

type PrintableEntry = {
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  gstRate: number;
  gstAmount: string;
  amount: string;
  numericAmount: number;
};

type CompanyProfile = ReturnType<typeof getCompanyProfile>;

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const PAGE_MARGIN = 40;
const HEADER_TOP = 780;
const TABLE_TOP = 640;
const TABLE_HEADER_HEIGHT = 28;
const TABLE_ROW_HEIGHT = 30;
const FOOTER_HEIGHT = 34;
const SIGNATURE_HEIGHT = 82;
const SUMMARY_HEIGHT = 42;
const STANDARD_ROW_CAPACITY = 13;
const LAST_PAGE_ROW_CAPACITY = 9;

const COLORS = {
  text: [0.13, 0.2, 0.33] as Rgb,
  muted: [0.45, 0.52, 0.63] as Rgb,
  border: [0.78, 0.83, 0.9] as Rgb,
  borderStrong: [0.55, 0.62, 0.74] as Rgb,
  tableHeader: [0.94, 0.96, 0.99] as Rgb,
  rowAlt: [0.975, 0.982, 0.992] as Rgb,
  income: [0.18, 0.43, 0.28] as Rgb,
  incomeTint: [0.9, 0.96, 0.91] as Rgb,
  expense: [0.55, 0.21, 0.22] as Rgb,
  expenseTint: [0.975, 0.93, 0.93] as Rgb,
  accent: [0.04, 0.5, 0.78] as Rgb
};

function normalizeCategory(entry: Entry) {
  if (Array.isArray(entry.category)) {
    return entry.category[0];
  }

  return entry.category ?? undefined;
}

function escapePdfText(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replaceAll("\r", " ")
    .replaceAll("\n", " ");
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1))}...`;
}

function rgb(color: Rgb) {
  return color.map((value) => value.toFixed(3)).join(" ");
}

function lineWidth(width: number) {
  return `${width.toFixed(2)} w`;
}

function moveTo(x: number, y: number) {
  return `${x.toFixed(2)} ${y.toFixed(2)} m`;
}

function lineTo(x: number, y: number) {
  return `${x.toFixed(2)} ${y.toFixed(2)} l`;
}

function curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
  return `${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)} ${x3.toFixed(2)} ${y3.toFixed(2)} c`;
}

function drawLine(x1: number, y1: number, x2: number, y2: number, color: Rgb, width = 1) {
  return [
    lineWidth(width),
    `${rgb(color)} RG`,
    moveTo(x1, y1),
    lineTo(x2, y2),
    "S"
  ].join("\n");
}

function drawRect(
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    fill?: Rgb;
    stroke?: Rgb;
    strokeWidth?: number;
  } = {}
) {
  const commands = [];

  if (options.fill) {
    commands.push(`${rgb(options.fill)} rg`);
  }

  if (options.stroke) {
    commands.push(`${rgb(options.stroke)} RG`);
  }

  if (options.strokeWidth) {
    commands.push(lineWidth(options.strokeWidth));
  }

  commands.push(`${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re`);

  if (options.fill && options.stroke) {
    commands.push("B");
  } else if (options.fill) {
    commands.push("f");
  } else {
    commands.push("S");
  }

  return commands.join("\n");
}

function drawRoundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  options: {
    fill?: Rgb;
    stroke?: Rgb;
    strokeWidth?: number;
  } = {}
) {
  const r = Math.min(radius, width / 2, height / 2);
  const k = 0.5522847498;
  const c = r * k;
  const commands = [];

  if (options.fill) {
    commands.push(`${rgb(options.fill)} rg`);
  }

  if (options.stroke) {
    commands.push(`${rgb(options.stroke)} RG`);
  }

  if (options.strokeWidth) {
    commands.push(lineWidth(options.strokeWidth));
  }

  commands.push(moveTo(x + r, y));
  commands.push(lineTo(x + width - r, y));
  commands.push(curveTo(x + width - r + c, y, x + width, y + r - c, x + width, y + r));
  commands.push(lineTo(x + width, y + height - r));
  commands.push(
    curveTo(
      x + width,
      y + height - r + c,
      x + width - r + c,
      y + height,
      x + width - r,
      y + height
    )
  );
  commands.push(lineTo(x + r, y + height));
  commands.push(curveTo(x + r - c, y + height, x, y + height - r + c, x, y + height - r));
  commands.push(lineTo(x, y + r));
  commands.push(curveTo(x, y + r - c, x + r - c, y, x + r, y));

  if (options.fill && options.stroke) {
    commands.push("B");
  } else if (options.fill) {
    commands.push("f");
  } else {
    commands.push("S");
  }

  return commands.join("\n");
}

function approxTextWidth(text: string, size: number) {
  return text.length * size * 0.52;
}

function drawText(
  text: string,
  x: number,
  y: number,
  options: {
    size?: number;
    font?: "F1" | "F2";
    color?: Rgb;
    align?: "left" | "right" | "center";
    width?: number;
  } = {}
) {
  const size = options.size ?? 10;
  const font = options.font ?? "F1";
  const color = options.color ?? COLORS.text;
  let drawX = x;

  if (options.align === "right" && options.width) {
    drawX = x + options.width - approxTextWidth(text, size);
  } else if (options.align === "center" && options.width) {
    drawX = x + (options.width - approxTextWidth(text, size)) / 2;
  }

  return [
    "BT",
    `/${font} ${size} Tf`,
    `${rgb(color)} rg`,
    `1 0 0 1 ${drawX.toFixed(2)} ${y.toFixed(2)} Tm`,
    `(${escapePdfText(text)}) Tj`,
    "ET"
  ].join("\n");
}

function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  }).format(date);
}

function formatAmount(value: number) {
  return `INR ${value.toFixed(2)}`;
}

function getPages(entries: PrintableEntry[]) {
  if (entries.length <= LAST_PAGE_ROW_CAPACITY) {
    return [entries];
  }

  const pages: PrintableEntry[][] = [];
  let cursor = 0;
  let remaining = entries.length;

  while (remaining > LAST_PAGE_ROW_CAPACITY) {
    const take = Math.min(STANDARD_ROW_CAPACITY, remaining - LAST_PAGE_ROW_CAPACITY);
    pages.push(entries.slice(cursor, cursor + take));
    cursor += take;
    remaining -= take;
  }

  pages.push(entries.slice(cursor));
  return pages;
}

function buildHeader(commands: string[], company: CompanyProfile) {
  commands.push(drawText(company.name.toUpperCase(), PAGE_MARGIN, HEADER_TOP, {
    size: 16,
    font: "F2",
    color: COLORS.accent
  }));
  commands.push(drawText("FINANCE OFFICE", PAGE_MARGIN, HEADER_TOP - 16, {
    size: 8,
    font: "F2",
    color: COLORS.muted
  }));
  commands.push(drawText("Financial Statement", PAGE_MARGIN, HEADER_TOP - 52, {
    size: 24,
    font: "F2",
    color: COLORS.text
  }));
  commands.push(drawText("Ledger Summary", PAGE_MARGIN, HEADER_TOP - 72, {
    size: 11,
    color: COLORS.muted
  }));

  const detailX = PAGE_WIDTH - 220;
  const detailY = HEADER_TOP;
  const details = [
    `Address: ${company.address}`,
    `GST / Tax ID: ${company.taxId}`,
    `Contact: ${company.contact}`
  ];

  details.forEach((line, index) => {
    commands.push(drawText(truncate(line, 42), detailX, detailY - index * 14, {
      size: 8.5,
      color: COLORS.muted
    }));
  });

  commands.push(drawLine(PAGE_MARGIN, HEADER_TOP - 90, PAGE_WIDTH - PAGE_MARGIN, HEADER_TOP - 90, COLORS.borderStrong, 1.2));
}

function buildTableHeader(commands: string[]) {
  const tableX = PAGE_MARGIN;
  const tableWidth = PAGE_WIDTH - PAGE_MARGIN * 2;
  const headerBottom = TABLE_TOP - TABLE_HEADER_HEIGHT;
  const columns = [
    { label: "Date", x: tableX, width: 70 },
    { label: "Type", x: tableX + 70, width: 70 },
    { label: "Category", x: tableX + 140, width: 100 },
    { label: "Description", x: tableX + 240, width: 120 },
    { label: "GST", x: tableX + 360, width: 45, align: "right" as const },
    { label: "GST Amt", x: tableX + 405, width: 70, align: "right" as const },
    { label: "Amount", x: tableX + 475, width: 80, align: "right" as const }
  ];

  commands.push(drawRect(tableX, headerBottom, tableWidth, TABLE_HEADER_HEIGHT, {
    fill: COLORS.tableHeader,
    stroke: COLORS.border,
    strokeWidth: 1
  }));

  columns.forEach((column) => {
    commands.push(drawText(column.label, column.x + 10, headerBottom + 10, {
      size: 8.5,
      font: "F2",
      color: COLORS.muted,
      align: column.align,
      width: column.width - 20
    }));
  });
}

function buildRows(commands: string[], rows: PrintableEntry[]) {
  const tableX = PAGE_MARGIN;
  const tableWidth = PAGE_WIDTH - PAGE_MARGIN * 2;
  const gstX = tableX + 360;
  const gstAmountX = tableX + 405;
  const amountX = tableX + 475;

  rows.forEach((row, index) => {
    const rowTop = TABLE_TOP - TABLE_HEADER_HEIGHT - index * TABLE_ROW_HEIGHT;
    const rowBottom = rowTop - TABLE_ROW_HEIGHT;

    if (index % 2 === 1) {
      commands.push(drawRect(tableX, rowBottom, tableWidth, TABLE_ROW_HEIGHT, {
        fill: COLORS.rowAlt
      }));
    }

    commands.push(drawLine(tableX, rowBottom, tableX + tableWidth, rowBottom, COLORS.border, 0.8));
    commands.push(drawText(row.date, tableX + 10, rowBottom + 10, { size: 9 }));

    const badgeColor = row.type === "income" ? COLORS.incomeTint : COLORS.expenseTint;
    const badgeText = row.type === "income" ? "INCOME" : "EXPENSE";
    const badgeTextColor = row.type === "income" ? COLORS.income : COLORS.expense;
    const badgeWidth = 54;
    const badgeX = tableX + 92;
    const badgeY = rowBottom + 6;

    commands.push(drawRoundedRect(badgeX, badgeY, badgeWidth, 18, 9, {
      fill: badgeColor,
      stroke: COLORS.border,
      strokeWidth: 0.6
    }));
    commands.push(drawText(badgeText, badgeX, badgeY + 5.5, {
      size: 7.5,
      font: "F2",
      color: badgeTextColor,
      align: "center",
      width: badgeWidth
    }));

    commands.push(drawText(truncate(row.category, 20), tableX + 140, rowBottom + 10, { size: 9 }));
    commands.push(drawText(truncate(row.description, 30), tableX + 240, rowBottom + 10, { size: 9 }));
    commands.push(drawText(`${row.gstRate.toFixed(2).replace(/\.00$/, "")}%`, gstX + 6, rowBottom + 10, {
      size: 9,
      align: "right",
      width: 50
    }));
    commands.push(drawText(row.gstAmount, gstAmountX + 6, rowBottom + 10, {
      size: 9,
      color: row.numericAmount >= 0 ? COLORS.income : COLORS.expense,
      align: "right",
      width: 58
    }));
    commands.push(drawText(row.amount, amountX + 8, rowBottom + 10, {
      size: 9,
      font: "F2",
      color: row.numericAmount >= 0 ? COLORS.income : COLORS.expense,
      align: "right",
      width: 32
    }));
  });

  const closingY = TABLE_TOP - TABLE_HEADER_HEIGHT - rows.length * TABLE_ROW_HEIGHT;
  commands.push(drawRect(tableX, closingY, tableWidth, TABLE_ROW_HEIGHT * rows.length + TABLE_HEADER_HEIGHT, {
    stroke: COLORS.border,
    strokeWidth: 1
  }));
}

function buildSummary(commands: string[], income: number, expense: number) {
  const net = income - expense;
  const y = FOOTER_HEIGHT + SIGNATURE_HEIGHT + 24;
  const x = PAGE_MARGIN;
  const width = PAGE_WIDTH - PAGE_MARGIN * 2;

  commands.push(drawLine(x, y + SUMMARY_HEIGHT, x + width, y + SUMMARY_HEIGHT, COLORS.borderStrong, 1.8));
  commands.push(drawRoundedRect(x, y, width, SUMMARY_HEIGHT, 10, {
    fill: [0.985, 0.989, 0.996],
    stroke: COLORS.border,
    strokeWidth: 1
  }));
  commands.push(drawText("Summary", x + 12, y + 15, { size: 10, font: "F2" }));
  commands.push(drawText(`Total Income: ${formatAmount(income)}`, x + 110, y + 15, {
    size: 9,
    color: COLORS.income
  }));
  commands.push(drawText(`Total Expense: ${formatAmount(expense)}`, x + 290, y + 15, {
    size: 9,
    color: COLORS.expense
  }));
  commands.push(drawText(`Net Balance: ${formatAmount(net)}`, x + 390, y + 15, {
    size: 10,
    font: "F2",
    color: net >= 0 ? COLORS.income : COLORS.expense,
    align: "right",
    width: width - 402
  }));
}

function buildSignature(commands: string[]) {
  const boxX = PAGE_WIDTH - 220;
  const boxY = FOOTER_HEIGHT + 16;
  const boxWidth = 180;
  const boxHeight = 52;

  commands.push(drawText("Authorized Signatory", boxX, boxY + boxHeight + 8, {
    size: 8.5,
    color: COLORS.muted
  }));
  commands.push(drawLine(boxX, boxY + 18, boxX + boxWidth, boxY + 18, COLORS.borderStrong, 1));
  commands.push(drawText("Signature", boxX, boxY + 4, {
    size: 8,
    color: COLORS.muted
  }));
}

function buildFooter(commands: string[], pageNumber: number, totalPages: number, generatedAt: string) {
  commands.push(drawLine(PAGE_MARGIN, FOOTER_HEIGHT + 18, PAGE_WIDTH - PAGE_MARGIN, FOOTER_HEIGHT + 18, COLORS.border, 0.8));
  commands.push(drawText(`Generated on ${generatedAt}`, PAGE_MARGIN, FOOTER_HEIGHT + 4, {
    size: 7.5,
    color: COLORS.muted
  }));
  commands.push(drawText(`Page ${pageNumber} of ${totalPages}`, PAGE_WIDTH - PAGE_MARGIN - 80, FOOTER_HEIGHT + 4, {
    size: 7.5,
    color: COLORS.muted,
    align: "right",
    width: 80
  }));
}

function buildPdf(entries: Entry[]) {
  const company = getCompanyProfile();
  const printableEntries = entries.map((entry) => {
    const category = normalizeCategory(entry);
    const signedAmount = entry.type === "income" ? Number(entry.amount) : -Number(entry.amount);
    const gstRate = Number(entry.gst_rate ?? 0);
    const gstAmount = Number(entry.amount) * (gstRate / 100);

    return {
      date: entry.occurred_on,
      type: entry.type,
      category: category?.name ?? "Uncategorized",
      description: entry.title,
      gstRate,
      gstAmount: formatAmount(gstAmount),
      amount: formatAmount(Math.abs(Number(entry.amount))),
      numericAmount: signedAmount
    } satisfies PrintableEntry;
  });

  const totals = printableEntries.reduce(
    (acc, entry) => {
      if (entry.type === "income") {
        acc.income += Math.abs(entry.numericAmount);
      } else {
        acc.expense += Math.abs(entry.numericAmount);
      }

      return acc;
    },
    { income: 0, expense: 0 }
  );

  const pages = getPages(printableEntries);
  const generatedAt = formatTimestamp();
  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");

  const pageObjectNumbers = pages.map((_, index) => 5 + index * 2);
  const kids = pageObjectNumbers.map((number) => `${number} 0 R`).join(" ");
  objects.push(`<< /Type /Pages /Count ${pages.length} /Kids [${kids}] >>`);
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  pages.forEach((pageEntries, index) => {
    const pageObjectNumber = pageObjectNumbers[index];
    const contentObjectNumber = pageObjectNumber + 1;
    const commands: string[] = [];

    buildHeader(commands, company);
    buildTableHeader(commands);
    buildRows(commands, pageEntries);

    if (index === pages.length - 1) {
      buildSummary(commands, totals.income, totals.expense);
      buildSignature(commands);
    }

    buildFooter(commands, index + 1, pages.length, generatedAt);

    const content = commands.join("\n");
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`
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
      .select("id,title,notes,amount,gst_rate,type,occurred_on,created_at,category:categories(name)")
      .order("occurred_on", { ascending: false });

    if (error) {
      throw error;
    }

    const rows = (data ?? []) as Entry[];
    const pdf = buildPdf(rows);
    const filename = `financial-statement-${new Date().toISOString().slice(0, 10)}.pdf`;

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Could not export financial statement." }, { status: 500 });
  }
}
