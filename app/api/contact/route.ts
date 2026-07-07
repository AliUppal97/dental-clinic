import { NextResponse } from "next/server";
import { siteData } from "@/lib/get-site-data";
import { createContactFormSchema } from "@/lib/contact-form-schema";

// TODO: connect to real email service (Resend/SendGrid) or booking system before launch

const serviceIds = siteData.servicesClinic.map((service) => service.id);
const contactFormSchema = createContactFormSchema(serviceIds);

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.errors[0]?.message ?? "Invalid form data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const submission = result.data;

    console.info("[contact] Appointment request received:", {
      name: submission.name,
      phone: submission.phone,
      preferredDate: submission.preferredDate,
      service: submission.service,
      messageLength: submission.message.length,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
