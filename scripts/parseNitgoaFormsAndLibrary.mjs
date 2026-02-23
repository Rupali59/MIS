import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import SitePage from "../src/models/SitePage";
import NitgoaFormOrDownload from "../src/models/NitgoaFormOrDownload";
import NitgoaLibraryResource from "../src/models/NitgoaLibraryResource";

function inferFormCategory(path) {
  const lower = path.toLowerCase();
  if (lower.includes("btech")) return "btech";
  if (lower.includes("mtech")) return "mtech";
  if (lower.includes("phd")) return "phd";
  if (lower.includes("medical")) return "medical";
  if (lower.includes("hostel")) return "hostel";
  if (lower.includes("internship")) return "internship";
  return "general";
}

async function parseForms() {
  const formPages = await SitePage.find({
    $or: [
      { path: /forms\.html$/i },
      { path: /edownload/i },
      {
        path: {
          $in: [
            "/btechforms.html",
            "/mtechforms.html",
            "/phdforms.html",
            "/medicalforms.html",
          ],
        },
      },
    ],
  })
    .lean()
    .exec();

  // eslint-disable-next-line no-console
  console.log(`Found ${formPages.length} form/download pages.`);

  for (const page of formPages) {
    const label = page.title || page.h1 || page.path;
    const category = inferFormCategory(page.path);
    const sourceSection = page.section || "unknown";

    // eslint-disable-next-line no-await-in-loop
    await NitgoaFormOrDownload.findOneAndUpdate(
      { url: page.path },
      {
        label,
        category,
        url: page.path,
        sourceSection,
        description: page.h1 ?? null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
  }
}

function inferLibraryType(path) {
  const lower = path.toLowerCase();
  if (lower.includes("/about/")) return "policy";
  if (lower.includes("/collection/")) return "collection";
  if (lower.includes("/ecollection/")) return "eresource";
  if (lower.includes("/learning/")) return "learning";
  if (lower.includes("/contact_us/")) return "contact";
  return "other";
}

function inferLibraryCategory(path) {
  const lower = path.toLowerCase();
  if (lower.includes("books")) return "books";
  if (lower.includes("periodicals")) return "periodicals";
  if (lower.includes("thesis")) return "thesis";
  if (lower.includes("elseiver")) return "elsevier";
  if (lower.includes("ieee")) return "ieee";
  if (lower.includes("science_e_books")) return "science_e_books";
  if (lower.includes("open")) return "openLearning";
  if (lower.includes("plagiarism")) return "plagiarism";
  if (lower.includes("shodh")) return "shodh";
  return null;
}

async function parseLibrary() {
  const libraryPages = await SitePage.find({
    path: /^\/library\//,
  })
    .lean()
    .exec();

  // eslint-disable-next-line no-console
  console.log(`Found ${libraryPages.length} library pages.`);

  for (const page of libraryPages) {
    const type = inferLibraryType(page.path);
    const category = inferLibraryCategory(page.path);
    const title = page.title || page.h1 || page.path;

    // eslint-disable-next-line no-await-in-loop
    await NitgoaLibraryResource.findOneAndUpdate(
      { url: page.path },
      {
        type,
        title,
        url: page.path,
        category,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();
  }
}

async function main() {
  await connectDB();

  await parseForms();
  await parseLibrary();

  await mongoose.connection.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error parsing NIT Goa forms/library:", err);
  process.exitCode = 1;
});

