import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <Container className="text-center">
        <h1 className="font-heading text-6xl text-primary-600 md:text-8xl">
          404
        </h1>
        <p className="mt-4 text-xl text-neutral-400">
          Oops! This page doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-pink-500 px-8 py-3 font-medium text-white hover:bg-pink-600"
        >
          Go Home
        </Link>
      </Container>
    </main>
  );
}
