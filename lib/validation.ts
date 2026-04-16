import { z } from "zod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const entrySchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120, "Title is too long."),
  amount: z
    .coerce
    .number()
    .finite("Amount must be a valid number.")
    .min(0, "Amount cannot be negative."),
  type: z.enum(["income", "expense"]),
  occurred_on: z.string().regex(isoDateRegex, "Date must be in YYYY-MM-DD format."),
  category_id: z.string().trim().min(1, "Category is required."),
  notes: z.string().trim().max(500, "Notes are too long.").optional().or(z.literal(""))
}).superRefine((value, ctx) => {
  const date = new Date(`${value.occurred_on}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value.occurred_on) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["occurred_on"],
      message: "Date is invalid."
    });
  }
});

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required.").max(60, "Category name is too long."),
  type: z.enum(["income", "expense"]),
  color: z
    .string()
    .trim()
    .regex(/^#(?:[0-9a-fA-F]{6})$/, "Color must be a valid hex value.")
    .default("#0f766e")
});

export function formatZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid input.";
}
