import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@sanity/client";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const resend = new Resend(process.env.RESEND_API_KEY);

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        prefix: "c4flow:contact",
      })
    : null;

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    if (ratelimit) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    const body = (await req.json()) as ContactPayload;
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (name.length > 200) {
      return NextResponse.json(
        { error: "Name must be under 200 characters." },
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

    const rawEmail = process.env.CONTACT_EMAIL || "marc@duby.io";
    const recipients = rawEmail.split(",").map((e) => e.trim());
    const replyToEmail = process.env.CONTACT_REPLY_TO || email;
    const fromAddress = process.env.RESEND_FROM_ADDRESS || "C4 Flow Website <noreply@mail.pixelpoetry.dev>";

    // Send email via Resend and store in Sanity concurrently
    const [emailResult] = await Promise.allSettled([
      resend.emails.send({
        from: fromAddress,
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
