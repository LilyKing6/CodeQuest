import type { MetadataRoute } from "next";
import { ALL_LEVELS, THEMES } from "@/content/registry";

const BASE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/leaderboard`, lastModified: now, changeFrequency: "hourly", priority: 0.7 },
    { url: `${BASE_URL}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
  const themePages: MetadataRoute.Sitemap = THEMES.map((t) => ({
    url: `${BASE_URL}/learn/${t.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const levelPages: MetadataRoute.Sitemap = ALL_LEVELS.map((l) => ({
    url: `${BASE_URL}/play/${l.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...staticPages, ...themePages, ...levelPages];
}
