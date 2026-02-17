import "server-only";

export const token = process.env.SANITY_API_READ_TOKEN;

if (!token) {
  console.warn(
    "⚠ SANITY_API_READ_TOKEN is not set. Draft mode / Visual Editing will be unavailable."
  );
}
