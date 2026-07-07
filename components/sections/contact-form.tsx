"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { siteData } from "@/lib/get-site-data";
import {
  createContactFormSchema,
  type ContactFormValues,
} from "@/lib/contact-form-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const { servicesClinic, sections } = siteData;

function todayInputValue(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const serviceIds = useMemo(
    () => servicesClinic.map((service) => service.id),
    []
  );
  const schema = useMemo(
    () => createContactFormSchema(serviceIds),
    [serviceIds]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      preferredDate: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data: { success?: boolean; error?: string } = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      toast.success(
        "Thank you! Your appointment request has been received. We'll be in touch soon."
      );
      reset();
    } catch {
      toast.error(
        "Unable to send your request. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (hasError: boolean) =>
    cn(hasError && "border-destructive focus-visible:ring-destructive/30");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
      aria-label="Appointment request form"
    >
      <p className="text-sm text-muted-foreground">
        Fields marked with <span className="text-destructive">*</span> are
        required.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={fieldClass(Boolean(errors.name))}
            {...register("name")}
          />
          {errors.name ? (
            <FieldError id="contact-name-error" message={errors.name.message!} />
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+92 300 1234567"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            className={fieldClass(Boolean(errors.phone))}
            {...register("phone")}
          />
          {errors.phone ? (
            <FieldError id="contact-phone-error" message={errors.phone.message!} />
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-date">
            Preferred Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-date"
            type="date"
            min={todayInputValue()}
            aria-invalid={Boolean(errors.preferredDate)}
            aria-describedby={
              errors.preferredDate ? "contact-date-error" : undefined
            }
            className={fieldClass(Boolean(errors.preferredDate))}
            {...register("preferredDate")}
          />
          {errors.preferredDate ? (
            <FieldError
              id="contact-date-error"
              message={errors.preferredDate.message!}
            />
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-service">
            Service Interested In <span className="text-destructive">*</span>
          </Label>
          <select
            id="contact-service"
            className={cn(
              "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              fieldClass(Boolean(errors.service))
            )}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={
              errors.service ? "contact-service-error" : undefined
            }
            {...register("service")}
          >
            <option value="" disabled>
              Select a service
            </option>
            {servicesClinic.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          {errors.service ? (
            <FieldError
              id="contact-service-error"
              message={errors.service.message!}
            />
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="contact-message"
          rows={4}
          placeholder="Tell us about your visit, preferred time, or any questions you have."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={fieldClass(Boolean(errors.message))}
          {...register("message")}
        />
        {errors.message ? (
          <FieldError id="contact-message-error" message={errors.message.message!} />
        ) : null}
      </div>

      <div className="flex flex-col gap-4 border-t border-border/60 pt-6 max-sm:pr-[4.5rem] sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {sections.contact.responseNote}
        </p>
        <Button
          type="submit"
          size="lg"
          className="min-h-11 w-full shrink-0 sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden="true" className="animate-spin" />
              Sending…
            </>
          ) : (
            "Request Appointment"
          )}
        </Button>
      </div>
    </form>
  );
}
