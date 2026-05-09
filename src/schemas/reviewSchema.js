import { z } from 'zod';

export const reviewSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone"),
  rating: z.number().min(1).max(5),
  message: z.string().min(5, "Message too short")
});