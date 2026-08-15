import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/signin",
        "/signup",
        "/admin",
        "/board",
        "/calendar",
        "/dashboard",
        "/projects",
        "/settings",
        "/tasks",
        "/teams",
      ],
    },
    sitemap: "https://taskfloo.in/sitemap.xml",
  };
}