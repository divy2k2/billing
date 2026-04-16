export function currency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);
}

export function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function monthLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}-01`));
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
}

export function dayLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short"
  }).format(parseIsoDate(value));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
