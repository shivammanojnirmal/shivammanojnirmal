import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number"),
  email: z.string().email("Invalid email format").optional().or(z.literal('')),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message too long")
});