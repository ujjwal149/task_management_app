import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/",
        "/tasks/",
        "/profile/",
        "/settings/",
      ],
    },
    sitemap: "https://taskfloo.in/sitemap.xml",
  };
}