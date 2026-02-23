import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import SitePage from "../src/models/SitePage";
import NitgoaDepartment from "../src/models/NitgoaDepartment";
import NitgoaFacultyProfile from "../src/models/NitgoaFacultyProfile";

const DEPARTMENT_CONFIG = [
  {
    code: "CSE",
    name: "Computer Science and Engineering",
    slug: "ComputerScience",
    rootPatterns: ["/ComputerScience/", "/academics/ComputerScience.html"],
  },
  {
    code: "EEE",
    name: "Electrical and Electronics Engineering",
    slug: "Electrical",
    rootPatterns: ["/Electrical/", "/academics/Electrical.html"],
  },
  {
    code: "ECE",
    name: "Electronics and Communication Engineering",
    slug: "Electronics",
    rootPatterns: ["/Electronics/", "/academics/Electronics.html"],
  },
  {
    code: "CIVIL",
    name: "Civil Engineering",
    slug: "Civil",
    rootPatterns: ["/civil_department/", "/academics/Civil.html"],
  },
  {
    code: "MECH",
    name: "Mechanical Engineering",
    slug: "Mechanical",
    rootPatterns: ["/Mechanical/", "/academics/Mechnical.html"],
  },
  {
    code: "ASH",
    name: "Applied Sciences and Humanities",
    slug: "AppliedScience",
    rootPatterns: ["/Applied%20Science/", "/academics/AppliedScience.html"],
  },
];

function findFirstUrl(pages, predicate) {
  const page = pages.find(predicate);
  return page ? page.path : null;
}

async function upsertDepartments() {
  const sitePages = await SitePage.find({ section: "department" }).lean().exec();

  // eslint-disable-next-line no-console
  console.log(`Found ${sitePages.length} department-related pages.`);

  for (const cfg of DEPARTMENT_CONFIG) {
    const matchingRoot = sitePages.filter((p) =>
      cfg.rootPatterns.some((pat) => p.path.startsWith(pat))
    );

    const overviewPage =
      findFirstUrl(sitePages, (p) =>
        cfg.rootPatterns.some((pat) => p.path === pat || p.path === `${pat}index.html`)
      ) ?? null;

    const contactPage =
      findFirstUrl(sitePages, (p) =>
        p.path.toLowerCase().includes("contact") &&
        cfg.rootPatterns.some((pat) => p.path.startsWith(pat))
      ) ?? null;

    const facultyPage =
      findFirstUrl(sitePages, (p) =>
        p.path.toLowerCase().includes("faculty") &&
        cfg.rootPatterns.some((pat) => p.path.startsWith(pat))
      ) ?? null;

    const staffPage =
      findFirstUrl(sitePages, (p) =>
        p.path.toLowerCase().includes("staff") &&
        cfg.rootPatterns.some((pat) => p.path.startsWith(pat))
      ) ?? null;

    const studentsPages = {
      btech: findFirstUrl(sitePages, (p) =>
        p.path.toLowerCase().includes("students/btech") &&
        cfg.rootPatterns.some((pat) => p.path.startsWith(pat))
      ),
      mtech: findFirstUrl(sitePages, (p) =>
        p.path.toLowerCase().includes("students/mtech") &&
        cfg.rootPatterns.some((pat) => p.path.startsWith(pat))
      ),
      phd: findFirstUrl(sitePages, (p) =>
        p.path.toLowerCase().includes("students/phd") &&
        cfg.rootPatterns.some((pat) => p.path.startsWith(pat))
      ),
    };

    const researchPages = matchingRoot
      .filter((p) => p.path.toLowerCase().includes("/research/"))
      .map((p) => p.path);

    const galleryPages = matchingRoot
      .filter((p) => p.path.toLowerCase().includes("/gallery/"))
      .map((p) => p.path);

    const formsPages = matchingRoot
      .filter((p) => p.path.toLowerCase().includes("forms") || p.path.toLowerCase().includes("edownload"))
      .map((p) => p.path);

    const rootUrls = Array.from(
      new Set(
        cfg.rootPatterns.concat(
          matchingRoot.map((p) => p.path)
        )
      )
    );

    // eslint-disable-next-line no-console
    console.log(`Upserting department ${cfg.code} (${cfg.slug}) with ${rootUrls.length} rootUrls.`);

    // eslint-disable-next-line no-await-in-loop
    await NitgoaDepartment.findOneAndUpdate(
      { code: cfg.code },
      {
        code: cfg.code,
        name: cfg.name,
        slug: cfg.slug,
        rootUrls,
        overviewPage,
        contactPage,
        facultyPage,
        staffPage,
        studentsPages,
        researchPages,
        galleryPages,
        formsPages,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
  }
}

function slugFromPath(path) {
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return last.replace(/\.html?$/i, "").toLowerCase();
}

async function upsertFacultyProfiles() {
  const peoplePages = await SitePage.find({
    $or: [
      { path: /^\/People\/frontend\// },
      { path: /people\/faculty\.html$/i },
    ],
  })
    .lean()
    .exec();

  // eslint-disable-next-line no-console
  console.log(`Found ${peoplePages.length} faculty-related pages.`);

  const departments = await NitgoaDepartment.find().lean().exec();

  const deptBySlug = new Map(departments.map((d) => [d.slug, d]));

  for (const page of peoplePages) {
    const lowerPath = page.path.toLowerCase();

    if (lowerPath.includes("people_faculty.html")) {
      // Skip generic listing pages for now; these can be used later to enrich profiles.
      // eslint-disable-next-line no-continue
      continue;
    }

    const name = page.h1 || page.title || slugFromPath(page.path);
    const slug = slugFromPath(page.path);

    let departmentId = null;
    if (page.subSection && deptBySlug.has(page.subSection)) {
      departmentId = deptBySlug.get(page.subSection)?._id ?? null;
    }

    const profileUrl = page.path;

    // eslint-disable-next-line no-console
    console.log(`Upserting faculty ${name} (${slug}) from ${profileUrl}`);

    // eslint-disable-next-line no-await-in-loop
    await NitgoaFacultyProfile.findOneAndUpdate(
      { slug, departmentId },
      {
        name,
        slug,
        departmentId,
        profileUrl,
        pageUrl: page.url,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
  }
}

async function main() {
  await connectDB();

  await upsertDepartments();
  await upsertFacultyProfiles();

  await mongoose.connection.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error parsing departments/faculty:", err);
  process.exitCode = 1;
});

