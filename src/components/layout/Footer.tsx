import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

interface FooterProps {
  siteName: string;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  instagramUrl?: string | null;
  address?: {
    street?: string;
    building?: string;
    city?: string;
  } | null;
  mapsUrl?: string | null;
  bookingUrl?: string | null;
}

export function Footer({
  siteName,
  logoUrl,
  email,
  phone,
  instagramUrl,
  address,
  mapsUrl,
  bookingUrl,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary-700 text-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 hover:opacity-80"
              aria-label={`${siteName} - Go to homepage`}
            >
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt=""
                  width={48}
                  height={50}
                  className="h-12 w-auto brightness-0 invert"
                />
              )}
              <span className="font-heading text-3xl text-white">
                {siteName}
              </span>
            </Link>
            <p className="mt-2 text-sm text-primary-200">
              Pole & Exotic Dance Studio
            </p>
            <p className="mt-1 text-sm italic text-primary-200">
              Move to Express
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 font-body text-sm font-bold uppercase tracking-wider text-primary-200">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-100 underline decoration-white/0 underline-offset-2 hover:text-white hover:decoration-white/30"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {bookingUrl && (
                <li>
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-pink-200 underline decoration-white/0 underline-offset-2 hover:text-white hover:decoration-white/30"
                  >
                    Book a Class
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 font-body text-sm font-bold uppercase tracking-wider text-primary-200">
              Contact
            </h3>
            <ul className="space-y-2">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 text-sm text-primary-100 hover:text-white"
                  >
                    <Mail size={14} />
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 text-sm text-primary-100 hover:text-white"
                  >
                    <Phone size={14} />
                    {phone}
                  </a>
                </li>
              )}
              {instagramUrl && (
                <li>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary-100 hover:text-white"
                  >
                    <Instagram size={14} />
                    @c_4_flow
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Location */}
          <div>
            <h3 className="mb-3 font-body text-sm font-bold uppercase tracking-wider text-primary-200">
              Location
            </h3>
            {address && (
              <a
                href={mapsUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 text-sm text-primary-100 hover:text-white"
              >
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>
                  {address.building && <>{address.building}<br /></>}
                  {address.street && <>{address.street}<br /></>}
                  {address.city}
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-primary-600 pt-6 text-center text-xs text-primary-200">
          &copy; {currentYear} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
