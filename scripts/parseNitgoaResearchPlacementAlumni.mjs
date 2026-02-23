import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import SitePage from "../src/models/SitePage";
import NitgoaDepartment from "../src/models/NitgoaDepartment";
import NitgoaResearchItem from "../src/models/NitgoaResearchItem";

function inferResearchType(path) {
  const lower = path.toLowerCase();
  if (lower.includes("details_of_mous")) return "mou";
  if (lower.includes("projects") || lower.includes("rdprojects")) return "projectList";
  if (lower.includes("journal")) return "journalList";
  if (lower.includes("conference")) return "conferenceList";
  if (lower.includes("gian")) return "gianCourse";
  return "other";
}

async function parseResearch() {
  const researchPages = await SitePage.find({
    $or: [{ path: /^\/research\// }, { path: /\/research\// }],
  })
    .lean()
    .exec();

  const departments = await NitgoaDepartment.find().lean().exec();
  const deptBySlug = new Map(departments.map((d) => [d.slug, d]));

  // eslint-disable-next-line no-console
  console.log(`Found ${researchPages.length} research-related pages.`);

  for (const page of researchPages) {
    const type = inferResearchType(page.path);
    const title = page.title || page.h1 || page.path;

    let departmentId = null;
    if (page.subSection && deptBySlug.has(page.subSection)) {
      departmentId = deptBySlug.get(page.subSection)?._id ?? null;
    }

    // eslint-disable-next-line no-await-in-loop
    await NitgoaResearchItem.findOneAndUpdate(
      { url: page.path },
      {
        type,
        title,
        url: page.path,
        departmentId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
  }
}

async function main() {
  await connectDB();

  await parseResearch();

  await mongoose.connection.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error parsing NIT Goa research/placement/alumni:", err);
  process.exitCode = 1;
});

