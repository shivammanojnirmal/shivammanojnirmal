import { z } from 'zod';

export const checkoutSchema = z.object({
  name: z.string().min(2, "Name required").trim(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  address: z.string().min(5, "Address required").optional()
});