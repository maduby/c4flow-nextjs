import { MapPin, MessageCircle, Mail, Clock } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { Container } from "@/components/shared/Container";

interface ContactInfoSectionProps {
  studioHours?: string | null;
  closedDay?: string | null;
}

interface ContactCard {
  icon: React.ReactNode;
  title: string;
  lines: string[];
  href?: string;
}

export async function ContactInfoSection({
  studioHours,
  closedDay,
}: ContactInfoSectionProps) {
  const { data: settings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
  });

  if (!settings) return null;

  const address = settings.address as {
    street?: string;
    building?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  } | null;

  const addressLines = address
    ? [
        [address.street, address.building].filter(Boolean).join(", "),
        [address.city, address.province, address.postalCode]
          .filter(Boolean)
          .join(", "),
      ].filter(Boolean)
    : [];

  const whatsappNumber = settings.whatsappNumber as string | null;
  const phone = settings.phone as string | null;
  const whatsappMessage = (settings.whatsappMessage as string | null) || "Hi! I'd like to find out more about C-4 Flow.";
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  const email = settings.contactEmail as string | null;
  const mapsUrl = settings.mapsUrl as string | null;

  const cards: ContactCard[] = [
    {
      icon: <MapPin size={28} strokeWidth={1.5} />,
      title: "Visit Us",
      lines: addressLines,
      href: mapsUrl || undefined,
    },
    {
      icon: <MessageCircle size={28} strokeWidth={1.5} />,
      title: "WhatsApp Us",
      lines: phone ? [phone] : [],
      href: whatsappHref || undefined,
    },
    {
      icon: <Mail size={28} strokeWidth={1.5} />,
      title: "Email Us",
      lines: email ? [email] : [],
      href: email ? `mailto:${email}` : undefined,
    },
    {
      icon: <Clock size={28} strokeWidth={1.5} />,
      title: "Studio Hours",
      lines: [
        studioHours || "By appointment only",
        closedDay || "Sunday: Closed",
      ],
    },
  ];

  return (
    <section className="py-12 md:py-20">
      <Container>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const cardClasses =
              "flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-border/60 bg-white px-5 py-8 text-center";

            const inner = (
              <>
                <div className="mb-3 text-primary-500">{card.icon}</div>
                <h3 className="font-heading text-xl text-neutral-800">
                  {card.title}
                </h3>
                <div className="mt-2 space-y-0.5 text-sm text-neutral-500">
                  {card.lines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </>
            );

            if (card.href) {
              return (
                <a
                  key={card.title}
                  href={card.href}
                  target={card.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={card.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className={`${cardClasses} transition-colors hover:border-pink-200 hover:bg-pink-50/30`}
                >
                  {inner}
                </a>
              );
            }

            return (
              <div key={card.title} className={cardClasses}>
                {inner}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
