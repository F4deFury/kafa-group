import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/settings", "/sign-in", "/auth"],
    },
    sitemap: "https://www.kafagroup.com/sitemap.xml",
  };
}
