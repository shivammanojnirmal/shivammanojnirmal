import { z } from 'zod';

export const loyaltySchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone")
});