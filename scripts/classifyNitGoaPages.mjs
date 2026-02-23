import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import SitePage from "../src/models/SitePage";
import { classifyNitGoaUrl } from "../src/lib/nitgoa/urlClassifier";

async function run() {
  await connectDB();

  const cursor = SitePage.find().cursor();

  // eslint-disable-next-line no-console
  console.log("Classifying NIT Goa sitePages...");

  // eslint-disable-next-line no-restricted-syntax
  for await (const page of cursor) {
    const { section, subSection } = classifyNitGoaUrl(page.path);

    if (section !== page.section || subSection !== page.subSection) {
      // eslint-disable-next-line no-console
      console.log(`Updating ${page.url} -> section=${section}, subSection=${subSection}`);
      // eslint-disable-next-line no-await-in-loop
      await SitePage.updateOne(
        { _id: page._id },
        { $set: { section, subSection } }
      ).exec();
    }
  }

  // eslint-disable-next-line no-console
  console.log("Done classifying sitePages.");
  await mongoose.connection.close();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error while classifying pages:", err);
  process.exitCode = 1;
});

