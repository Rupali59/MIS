import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import SitePage from "../src/models/SitePage";
import NitgoaDepartment from "../src/models/NitgoaDepartment";
import NitgoaProgram from "../src/models/NitgoaProgram";

function inferLevelFromPath(path) {
  const lower = path.toLowerCase();
  if (lower.includes("btech")) return "btech";
  if (lower.includes("mtech")) return "mtech";
  if (lower.includes("phd")) return "phd";
  if (lower.includes("minor")) return "minor";
  return "other";
}

function inferBatchFromPath(path) {
  const match = path.match(/(20[0-9]{2})/);
  if (!match) return null;
  const year = Number.parseInt(match[1], 10);
  return Number.isNaN(year) ? null : year;
}

async function parseGlobalPrograms() {
  const calendarPages = await SitePage.find({
    path: {
      $in: [
        "/academics/academic_calendar.html",
        "/academic_calendar.html",
        "/academics/calendar.html",
      ],
    },
  })
    .lean()
    .exec();

  const regulationsPages = await SitePage.find({
    path: { $in: ["/academics/regulations.html", "/academics/rules_and_regulations.html"] },
  })
    .lean()
    .exec();

  const handbookPages = await SitePage.find({
    path: "/academics/btechhandbook.html",
  })
    .lean()
    .exec();

  const globalSyllabusPages = await SitePage.find({
    path: { $in: ["/syllabus.html", "/academics/dissertation.html"] },
  })
    .lean()
    .exec();

  const commonRegulationUrls = regulationsPages.map((p) => p.path);
  const commonSyllabusUrls = globalSyllabusPages.map((p) => p.path);
  const handbookUrl = handbookPages[0]?.path ?? null;

  if (handbookUrl || commonRegulationUrls.length || commonSyllabusUrls.length) {
    // Treat as generic institute-wide B.Tech program metadata.
    await NitgoaProgram.findOneAndUpdate(
      { departmentId: null, level: "btech", name: "B.Tech (Institute-wide)" },
      {
        departmentId: null,
        level: "btech",
        name: "B.Tech (Institute-wide)",
        handbookUrl,
        regulationUrls: commonRegulationUrls,
        syllabusUrls: commonSyllabusUrls,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
  }
}

async function parseDepartmentPrograms() {
  const departments = await NitgoaDepartment.find().lean().exec();
  const deptBySlug = new Map(departments.map((d) => [d.slug, d]));

  const deptPages = await SitePage.find({ section: "department" }).lean().exec();

  for (const page of deptPages) {
    const deptSlug = page.subSection;
    if (!deptSlug || !deptBySlug.has(deptSlug)) continue;
    const dept = deptBySlug.get(deptSlug);
    if (!dept) continue;

    const level = inferLevelFromPath(page.path);
    if (level === "other") continue;

    const batch = inferBatchFromPath(page.path);

    const name = `${level.toUpperCase()} in ${dept.name}${
      batch ? ` (Batch ${batch})` : ""
    }`;

    const syllabusUrls = page.path.toLowerCase().includes("syllabus")
      ? [page.path]
      : [];

    const regulationUrls = page.path.toLowerCase().includes("regulation")
      ? [page.path]
      : [];

    await NitgoaProgram.findOneAndUpdate(
      {
        departmentId: dept._id,
        level,
        batch,
        name,
      },
      {
        departmentId: dept._id,
        level,
        batch,
        name,
        $addToSet: {
          syllabusUrls: { $each: syllabusUrls },
          regulationUrls: { $each: regulationUrls },
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
  }
}

async function main() {
  await connectDB();

  await parseGlobalPrograms();
  await parseDepartmentPrograms();

  await mongoose.connection.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error parsing NIT Goa programs:", err);
  process.exitCode = 1;
});

