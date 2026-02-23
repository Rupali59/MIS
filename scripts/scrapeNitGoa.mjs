import fs from "node:fs/promises";
import { parse } from "node-html-parser";

const RAW_PAGES = [
  // 🏛️ Administration & Institutional
  {
    section: "Administration & Institutional",
    name: "About NIT Goa",
    url: "https://www.nitgoa.ac.in/about.html",
  },
  {
    section: "Administration & Institutional",
    name: "Director's Message",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/administration/director.html",
  },
  {
    section: "Administration & Institutional",
    name: "Board of Governors",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/administration/bog.html",
  },
  {
    section: "Administration & Institutional",
    name: "Senate",
    url: "https://www.nitgoa.ac.in/administration/senate.html",
  },
  {
    section: "Administration & Institutional",
    name: "Registrar",
    url: "https://www.nitgoa.ac.in/administration/registrar.html",
  },
  {
    section: "Administration & Institutional",
    name: "Deans",
    url: "https://www.nitgoa.ac.in/administration/deans.html",
  },
  {
    section: "Administration & Institutional",
    name: "Heads of Departments (HoDs)",
    url: "https://www.nitgoa.ac.in/administration/hod.html",
  },
  {
    section: "Administration & Institutional",
    name: "RTI",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/rti.html",
  },
  {
    section: "Administration & Institutional",
    name: "Annual Reports",
    url: "https://www.nitgoa.ac.in/administration/reports.html",
  },
  {
    section: "Administration & Institutional",
    name: "NIRF",
    url: "https://www.nitgoa.ac.in/nirf.html",
  },

  // 🎓 Academic & Student Resources
  {
    section: "Academic & Student Resources",
    name: "Academics Overview",
    url: "https://www.nitgoa.ac.in/academics/departments.html",
  },
  {
    section: "Academic & Student Resources",
    name: "Academic Calendar",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/academics/calendar.html",
  },
  {
    section: "Academic & Student Resources",
    name: "Time Tables",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/academics/timetable.html",
  },
  {
    section: "Academic & Student Resources",
    name: "Curriculum & Regulations",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/academics/regulations.html",
  },
  {
    section: "Academic & Student Resources",
    name: "Dissertation Formats",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/academics/dissertation.html",
  },
  {
    section: "Academic & Student Resources",
    name: "Examination Results",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/academics/results.html",
  },
  {
    section: "Academic & Student Resources",
    name: "Library Home",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/library/index.html",
  },
  {
    section: "Academic & Student Resources",
    name: "E-Resources Policy",
    url: "https://www.nitgoa.ac.in/library/about/eresource.html",
  },

  // 📩 Admissions & Recruitment
  {
    section: "Admissions & Recruitment",
    name: "B.Tech (JoSAA/DASA)",
    url: "https://www.nitgoa.ac.in/admissions/josaa.html",
  },
  {
    section: "Admissions & Recruitment",
    name: "M.Tech (CCMT)",
    url: "https://www.nitgoa.ac.in/admissions/mtech.html",
  },
  {
    section: "Admissions & Recruitment",
    name: "Ph.D. Admissions",
    url: "https://www.nitgoa.ac.in/admissions/phd.html",
  },
  {
    section: "Admissions & Recruitment",
    name: "Fee Structure",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/admissions/fees.html",
  },
  {
    section: "Admissions & Recruitment",
    name: "Faculty & Staff Recruitment",
    url: "https://www.nitgoa.ac.in/recruitment.html",
  },

  // 🔬 Departments & Faculty
  {
    section: "Departments & Faculty",
    name: "Computer Science",
    url: "https://www.nitgoa.ac.in/People/frontend/people_faculty.html",
  },
  {
    section: "Departments & Faculty",
    name: "Electronics & Communication",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/People/frontend/Ece.html",
  },
  {
    section: "Departments & Faculty",
    name: "Electrical & Electronics",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/People/frontend/Eee.html",
  },
  {
    section: "Departments & Faculty",
    name: "Civil Engineering",
    url: "https://www.nitgoa.ac.in/People/frontend/Cve.html",
  },
  {
    section: "Departments & Faculty",
    name: "Mechanical Engineering",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/People/frontend/Mech.html",
  },
  {
    section: "Departments & Faculty",
    name: "Applied Sciences",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/People/frontend/AppliedScience.html",
  },
  {
    section: "Departments & Faculty",
    name: "Humanities",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/People/frontend/Humanities.html",
  },

  // 🔗 Quick Links & Directories
  {
    section: "Quick Links & Directories",
    name: "Telephone Directory (PDF)",
    url: "https://www.nitgoa.ac.in/static/TelephoneDirectory.pdf",
  },
  {
    section: "Quick Links & Directories",
    name: "Contact Us",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/contact.html",
  },
  {
    section: "Quick Links & Directories",
    name: "Online Application Portal",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/admissions/online_portal.html",
  },
  {
    section: "Quick Links & Directories",
    name: "Hostels",
    url: "https://www.google.com/search?q=https://www.nitgoa.ac.in/hostel.html",
  },
  {
    section: "Quick Links & Directories",
    name: "E-Downloads (Forms/Circulars)",
    url: "https://www.nitgoa.ac.in/btechforms.html",
  },
];

function normalizeNitGoaUrl(rawUrl) {
  if (rawUrl.startsWith("https://www.google.com")) {
    try {
      const parsed = new URL(rawUrl);
      const q = parsed.searchParams.get("q");
      if (q && q.startsWith("https://www.nitgoa.ac.in")) {
        return q;
      }
    } catch {
      // fall through
    }
  }
  return rawUrl;
}

const PAGES = RAW_PAGES.map((page) => ({
  ...page,
  url: normalizeNitGoaUrl(page.url),
}));

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "MIS-scraper/1.0 (+for internal use; contact: admin@example.com)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.text();
}

function extractContent(html, url) {
  const root = parse(html);

  const title =
    root.querySelector("title")?.text.trim().replace(/\s+/g, " ") || null;
  const h1 =
    root.querySelector("h1")?.text.trim().replace(/\s+/g, " ") || null;

  // Try to locate the main content region, fall back to body
  const mainNode =
    root.querySelector("main") ||
    root.querySelector("#content") ||
    root.querySelector(".content") ||
    root.querySelector("body") ||
    root;

  const mainText = mainNode.text.replace(/\s+/g, " ").trim();

  return {
    url,
    title,
    h1,
    text: mainText,
  };
}

async function scrapeAll() {
  const results = [];

  for (const page of PAGES) {
    const { section, name, url } = page;
    // eslint-disable-next-line no-console
    console.log(`Scraping: [${section}] ${name} -> ${url}`);

    try {
      const html = await fetchHtml(url);
      const content = extractContent(html, url);

      results.push({
        section,
        name,
        ...content,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error scraping ${url}:`, err.message);
      results.push({
        section,
        name,
        url,
        error: err.message || String(err),
      });
    }
  }

  return results;
}

async function main() {
  const pages = await scrapeAll();

  const output = {
    scrapedAt: new Date().toISOString(),
    total: pages.length,
    pages,
  };

  const dataDir = new URL("../data/", import.meta.url);
  const outputFile = new URL("./nitgoa-scrape.json", dataDir);

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(outputFile, JSON.stringify(output, null, 2), "utf8");

  // eslint-disable-next-line no-console
  console.log(`Saved ${pages.length} pages to ${outputFile.pathname}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error while scraping NIT Goa:", err);
  process.exitCode = 1;
});

