import { z } from 'zod';

export const feedbackSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian mobile number").optional().or(z.literal('')),
  nps_score: z.number().int().min(0).max(10, "Score must be between 0 and 10"),
  comment: z.string().max(500, "Comment cannot exceed 500 characters").optional(),
  page: z.string().min(1)
});