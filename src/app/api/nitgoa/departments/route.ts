import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import NitgoaDepartment from "@/src/models/NitgoaDepartment";
import NitgoaFacultyProfile from "@/src/models/NitgoaFacultyProfile";

export async function GET() {
  await connectDB();

  const departments = await NitgoaDepartment.find().lean().exec();

  const deptIds = departments.map((d) => d._id);

  const facultyByDept = await NitgoaFacultyProfile.aggregate([
    { $match: { departmentId: { $in: deptIds } } },
    { $group: { _id: "$departmentId", count: { $sum: 1 } } },
  ]);

  const facultyCountMap = new Map(
    facultyByDept.map((f) => [String(f._id), f.count as number])
  );

  const data = departments.map((d) => ({
    id: d._id,
    code: d.code,
    name: d.name,
    slug: d.slug,
    rootUrls: d.rootUrls,
    overviewPage: d.overviewPage,
    contactPage: d.contactPage,
    facultyPage: d.facultyPage,
    staffPage: d.staffPage,
    studentsPages: d.studentsPages,
    researchPages: d.researchPages,
    galleryPages: d.galleryPages,
    formsPages: d.formsPages,
    facultyCount: facultyCountMap.get(String(d._id)) ?? 0,
  }));

  return NextResponse.json({ departments: data });
}

