import mongoose, { Schema, model, models } from "mongoose";

export interface INitgoaFacultyProfile {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  departmentId?: mongoose.Types.ObjectId | null;
  designation?: string | null;
  email?: string | null;
  phone?: string | null;
  officeLocation?: string | null;
  researchAreas?: string[];
  education?: string[];
  profileUrl: string;
  photoUrl?: string | null;
  pageUrl?: string | null;
}

const NitgoaFacultyProfileSchema = new Schema<INitgoaFacultyProfile>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "NitgoaDepartment" },
    designation: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    officeLocation: { type: String, default: null },
    researchAreas: { type: [String], default: [] },
    education: { type: [String], default: [] },
    profileUrl: { type: String, required: true },
    photoUrl: { type: String, default: null },
    pageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

NitgoaFacultyProfileSchema.index({ slug: 1, departmentId: 1 }, { unique: true });

export default models.NitgoaFacultyProfile ??
  model<INitgoaFacultyProfile>("NitgoaFacultyProfile", NitgoaFacultyProfileSchema);

