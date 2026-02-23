import mongoose, { Schema, model, models } from "mongoose";

export interface IStaffCourseHistory {
  _id: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  academicYear: string;
  semester: string;
  role: "Instructor" | "Co-Instructor" | "TA";
}

const schema = new Schema<IStaffCourseHistory>(
  {
    staff: { type: Schema.Types.ObjectId, ref: "StaffMember", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    academicYear: { type: String, required: true },
    semester: { type: String, required: true },
    role: { type: String, required: true, enum: ["Instructor", "Co-Instructor", "TA"] },
  },
  { timestamps: true }
);

export default models.StaffCourseHistory ?? model<IStaffCourseHistory>("StaffCourseHistory", schema);

