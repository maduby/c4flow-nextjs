import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Temporary hero placeholder */}
      <section className="flex min-h-[80vh] items-center justify-center bg-primary-600 text-white">
        <div className="text-center">
          <h1 className="font-heading text-6xl md:text-8xl mb-4">
            {SITE_CONFIG.name}
          </h1>
          <p className="text-2xl md:text-3xl font-body mb-2">
            {SITE_CONFIG.tagline}
          </p>
          <p className="text-xl font-body italic text-primary-200">
            {SITE_CONFIG.motto}
          </p>
        </div>
      </section>

      {/* Temporary content placeholder */}
      <section className="py-20 px-6 max-w-[1440px] mx-auto text-center">
        <h2 className="font-heading text-4xl text-primary-600 mb-6">
          Site Under Construction
        </h2>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          The new C-4 Flow website is being built with Next.js, Sanity CMS, and
          Tailwind CSS. Check back soon for the full experience.
        </p>
      </section>
    </main>
  );
}
