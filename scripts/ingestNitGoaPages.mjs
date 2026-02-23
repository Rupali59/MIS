import fs from "node:fs/promises";
import { parse } from "node-html-parser";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import SitePage from "../src/models/SitePage";
import { classifyNitGoaUrl } from "../src/lib/nitgoa/urlClassifier";

function normalizeUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    u.hash = "";
    if (u.pathname) {
      u.pathname = u.pathname.replace(/\/{2,}/g, "/");
    }
    return u.toString();
  } catch {
    return rawUrl;
  }
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "MIS-ingest/1.0 (+for internal use)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const statusCode = res.status;

  if (!res.ok || !contentType.includes("text/html")) {
    throw new Error(`Status ${statusCode} (${contentType})`);
  }

  const html = await res.text();
  return { html, contentType, statusCode };
}

function extractContent(html, url) {
  const root = parse(html);
  const title =
    root.querySelector("title")?.text.trim().replace(/\s+/g, " ") || null;
  const h1 =
    root.querySelector("h1")?.text.trim().replace(/\s+/g, " ") || null;

  const mainNode =
    root.querySelector("main") ||
    root.querySelector("#content") ||
    root.querySelector(".content") ||
    root.querySelector("body") ||
    root;

  const text = mainNode.text.replace(/\s+/g, " ").trim();

  const { pathname, hostname } = new URL(url);
  const { section, subSection } = classifyNitGoaUrl(pathname);

  return {
    url,
    path: pathname,
    domain: hostname,
    section,
    subSection,
    title,
    h1,
    text,
  };
}

async function loadSitemapUrls() {
  const fileUrl = new URL("../data/nitgoa-sitemap.json", import.meta.url);
  const raw = await fs.readFile(fileUrl, "utf8");
  const json = JSON.parse(raw);
  const urls = Array.isArray(json.urls) ? json.urls : [];
  const normalized = urls
    .filter((u) => typeof u === "string")
    .map((u) => normalizeUrl(u));
  return Array.from(new Set(normalized));
}

async function ingest() {
  await connectDB();

  const urls = await loadSitemapUrls();
  const now = new Date();

  // eslint-disable-next-line no-console
  console.log(`Ingesting ${urls.length} NIT Goa pages into MongoDB...`);

  for (const url of urls) {
    try {
      const { html, contentType, statusCode } = await fetchHtml(url);
      const content = extractContent(html, url);

      await SitePage.findOneAndUpdate(
        { url: content.url },
        {
          ...content,
          metadata: {
            crawledAt: now,
            lastSeen: now,
            contentType,
            statusCode,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).exec();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error ingesting ${url}:`, err.message || err);
    }
  }

  // eslint-disable-next-line no-console
  console.log("Done ingesting NIT Goa pages.");
  await mongoose.connection.close();
}

ingest().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error during ingest:", err);
  process.exitCode = 1;
});

