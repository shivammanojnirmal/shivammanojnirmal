import { z } from 'zod';

export const bookingSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .trim(),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  vehicle: z.string()
    .min(1, "Please select a vehicle"),
  service_type: z.string()
    .min(1, "Please select a service type"),
  preferred_date: z.string()
    .min(1, "Please select a preferred date")
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, {
      message: "Preferred date cannot be in the past"
    })
});