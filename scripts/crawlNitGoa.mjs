import fs from "node:fs/promises";
import { parse } from "node-html-parser";

const START_URLS = ["https://www.nitgoa.ac.in/"];
const MAX_PAGES = Number.parseInt(process.env.NITGOA_MAX_PAGES || "2000", 10);

function normalizeUrl(url, base) {
  try {
    const u = new URL(url, base);

    if (u.hostname !== "www.nitgoa.ac.in" && u.hostname !== "nitgoa.ac.in") {
      return null;
    }

    // Drop fragments
    u.hash = "";

    // Canonicalise path: collapse repeated slashes like "///academics//" -> "/academics/"
    if (u.pathname) {
      u.pathname = u.pathname.replace(/\/{2,}/g, "/");
    }

    return u.toString();
  } catch {
    return null;
  }
}

function isHtmlLike(url) {
  return !url.match(
    /\.(pdf|jpg|jpeg|png|gif|svg|css|js|ico|zip|rar|docx?|xlsx?)$/i,
  );
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "MIS-crawler/1.0 (+for internal use)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || !contentType.includes("text/html")) {
    throw new Error(`Status ${res.status} (${contentType})`);
  }

  return res.text();
}

async function loadSeedUrlsFromScrape() {
  try {
    const fileUrl = new URL("../data/nitgoa-scrape.json", import.meta.url);
    const raw = await fs.readFile(fileUrl, "utf8");
    const json = JSON.parse(raw);

    const pages = Array.isArray(json.pages) ? json.pages : [];
    const urls = pages
      .map((p) => p && typeof p.url === "string" ? p.url : null)
      .filter((u) => typeof u === "string")
      .map((u) => normalizeUrl(u, "https://www.nitgoa.ac.in/"))
      .filter(Boolean);

    return Array.from(new Set(urls));
  } catch {
    // If the file doesn't exist or is malformed, just ignore.
    return [];
  }
}

async function crawl() {
  const extraSeeds = await loadSeedUrlsFromScrape();
  const initial = Array.from(new Set([...START_URLS, ...extraSeeds]));

  const queue = [...initial];
  const visited = new Set();
  const discovered = [];

  while (queue.length && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);

    // eslint-disable-next-line no-console
    console.log(`Crawling (${visited.size}/${MAX_PAGES}): ${url}`);

    try {
      const html = await fetchHtml(url);
      discovered.push(url);

      const root = parse(html);
      const links = root.querySelectorAll("a");

      for (const a of links) {
        const href = a.getAttribute("href");
        if (!href) continue;

        const normalized = normalizeUrl(href, url);
        if (!normalized || !isHtmlLike(normalized)) continue;

        if (!visited.has(normalized) && !queue.includes(normalized)) {
          queue.push(normalized);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error on ${url}:`, err.message || err);
    }
  }

  const output = {
    crawledAt: new Date().toISOString(),
    total: discovered.length,
    urls: discovered.sort(),
  };

  const dataDir = new URL("../data/", import.meta.url);
  const outputFile = new URL("./nitgoa-sitemap.json", dataDir);

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(output, null, 2), "utf8");

  // eslint-disable-next-line no-console
  console.log(`Saved sitemap with ${output.total} URLs to ${outputFile.pathname}`);
}

crawl().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error in crawler:", err);
  process.exitCode = 1;
});

