import { z } from 'zod';

export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code is too short").max(20, "Coupon code is too long").toUpperCase().trim()
});