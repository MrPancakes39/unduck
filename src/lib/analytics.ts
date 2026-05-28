import posthog from "posthog-js";

// Posthog Analytics
if (import.meta.env.VITE_POSTHOG_API_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
    api_host: "https://eu.i.posthog.com",
    defaults: "2026-01-30",
  });
}
