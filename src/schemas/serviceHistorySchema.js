import { z } from 'zod';

export const serviceHistorySchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number")
});