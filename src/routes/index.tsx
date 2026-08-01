import { createFileRoute } from "@tanstack/react-router";

// The training guide itself is a dependency-free HTML/CSS/JS app served from
// /app/index.html. This route embeds it full-screen so "/" opens the dashboard.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saurion Gaming · eFootball Player Training Guide" },
      {
        name: "description",
        content:
          "Build eFootball player training guides: edit progression, stats and skills, then export a 1:1 PNG.",
      },
      { property: "og:title", content: "Saurion Gaming · eFootball Player Training Guide" },
      {
        property: "og:description",
        content:
          "Premium eFootball companion dashboard by Saurion Gaming with editable stats, skills and PNG export.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      title="Saurion Gaming eFootball Player Training Guide"
      src="/app/index.html"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
}
