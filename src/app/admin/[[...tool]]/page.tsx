"use client";

import dynamic from "next/dynamic";

const NextStudio = dynamic(() => import("next-sanity/studio").then((mod) => mod.NextStudio), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-[#101112]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-white" />
        <p className="text-sm text-gray-400">Loading Studio...</p>
      </div>
    </div>
  ),
});

import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
