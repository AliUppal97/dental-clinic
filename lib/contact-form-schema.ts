import { z } from "zod";

const phonePattern = /^[\d\s+\-()]+$/;

function isTodayOrFuture(dateString: string): boolean {
  const selected = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(selected.getTime()) && selected >= today;
}

export function createContactFormSchema(serviceIds: string[]) {
  const serviceSchema =
    serviceIds.length > 0
      ? z.enum(serviceIds as [string, ...string[]], {
          errorMap: () => ({ message: "Please select a service" }),
        })
      : z.string().min(1, "Please select a service");

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your full name")
      .max(100, "Name is too long"),
    phone: z
      .string()
      .trim()
      .min(10, "Please enter a valid phone number")
      .max(20, "Please enter a valid phone number")
      .regex(phonePattern, "Please enter a valid phone number"),
    preferredDate: z
      .string()
      .min(1, "Please select a preferred date")
      .refine(isTodayOrFuture, "Please choose today or a future date"),
    service: serviceSchema,
    message: z
      .string()
      .trim()
      .min(10, "Please tell us a little more about your visit (at least 10 characters)")
      .max(1000, "Message is too long"),
  });
}

export type ContactFormValues = z.infer<
  ReturnType<typeof createContactFormSchema>
>;
