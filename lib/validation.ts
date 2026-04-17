import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100, "Name is too long.").optional(),
  customerName: z.string().trim().min(1, "Name is required.").max(100, "Name is too long.").optional(),
  phone: z.string().trim().min(1, "Phone number is required.").max(20, "Phone number is too long."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
  service: z.string().trim().max(100, "Service description is too long.").optional(),
  serviceType: z.string().trim().max(50, "Service type is too long.").optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().trim().max(50, "Time preference is too long.").optional(),
  description: z.string().trim().max(500, "Description is too long.").optional().or(z.literal("")),
  address: z.string().trim().max(200, "Address is too long.").optional(),
  bookingType: z.enum(["service", "plumber"])
});

export function formatZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid input.";
}
