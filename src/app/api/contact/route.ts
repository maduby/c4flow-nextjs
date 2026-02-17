import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@sanity/client";

const resend = new Resend(process.env.RESEND_API_KEY);

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message must be under 2000 characters." },
        { status: 400 }
      );
    }

    // TODO [GO-LIVE]: Change CONTACT_EMAIL env var to info@c4flow.co.za
    // TODO [GO-LIVE]: Remove CONTACT_REPLY_TO env var (defaults to visitor's email)
    const rawEmail = process.env.CONTACT_EMAIL || "info@c4flow.co.za";
    const recipients = rawEmail.split(",").map((e) => e.trim());
    const replyToEmail = process.env.CONTACT_REPLY_TO || email;

    // Send email via Resend and store in Sanity concurrently
    const [emailResult] = await Promise.allSettled([
      resend.emails.send({
        from: `C4 Flow Website <noreply@mail.pixelpoetry.dev>`,
        to: recipients,
        replyTo: replyToEmail,
        subject: `New contact from ${name} — C4 Flow Website`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          ``,
          `Message:`,
          message,
          ``,
          `---`,
          `Sent from the C4 Flow website contact form.`,
        ].join("\n"),
      }),
      sanityClient.create({
        _type: "contactSubmission",
        name,
        email,
        message,
        read: false,
        submittedAt: new Date().toISOString(),
      }),
    ]);

    if (emailResult.status === "rejected") {
      console.error("Resend error:", emailResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
