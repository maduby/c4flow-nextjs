/**
 * Canonical site origin for metadata (canonical links, Open Graph, JSON-LD, sitemap).
 *
 * Production builds default to https://c4flow.co.za so deploys served from
 * *.vercel.app still declare the real domain — otherwise Google may index the
 * Vercel hostname.
 *
 * We never use *.vercel.app here: teams often set NEXT_PUBLIC_SITE_URL to the
 * Vercel preview URL on Vercel — that must not become the sitemap or canonical base.
 *
 * Optional override: NEXT_PUBLIC_CANONICAL_SITE_URL (no trailing slash), must not
 * be a vercel.app host.
 */
const PRODUCTION_ORIGIN = "https://c4flow.co.za";

function hostnameIsVercelDeployment(host: string): boolean {
  return host === "vercel.app" || host.endsWith(".vercel.app");
}

function originFromUrlString(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  try {
    const u = new URL(raw);
    return u.origin;
  } catch {
    return null;
  }
}

export function getSiteOriginForMetadata(): string {
  const explicit = originFromUrlString(
    process.env.NEXT_PUBLIC_CANONICAL_SITE_URL?.replace(/\/$/, "")
  );
  if (
    explicit &&
    !hostnameIsVercelDeployment(new URL(explicit).hostname)
  ) {
    return explicit;
  }

  if (process.env.NODE_ENV === "development") {
    const dev =
      originFromUrlString(process.env.NEXT_PUBLIC_SITE_URL) ||
      "http://localhost:3000";
    return dev;
  }

  // Production / `next start`: ignore NEXT_PUBLIC_SITE_URL if it points at Vercel
  const siteUrl = originFromUrlString(process.env.NEXT_PUBLIC_SITE_URL);
  if (
    siteUrl &&
    !hostnameIsVercelDeployment(new URL(siteUrl).hostname)
  ) {
    return siteUrl;
  }

  return PRODUCTION_ORIGIN;
}
