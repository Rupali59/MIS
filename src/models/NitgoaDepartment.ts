import mongoose, { Schema, model, models } from "mongoose";

export interface INitgoaDepartment {
  _id: mongoose.Types.ObjectId;
  code: string;
  name: string;
  slug: string;
  rootUrls: string[];
  overviewPage?: string | null;
  contactPage?: string | null;
  facultyPage?: string | null;
  staffPage?: string | null;
  studentsPages?: {
    btech?: string;
    mtech?: string;
    phd?: string;
  };
  researchPages?: string[];
  galleryPages?: string[];
  formsPages?: string[];
}

const NitgoaDepartmentSchema = new Schema<INitgoaDepartment>(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    rootUrls: { type: [String], default: [] },
    overviewPage: { type: String, default: null },
    contactPage: { type: String, default: null },
    facultyPage: { type: String, default: null },
    staffPage: { type: String, default: null },
    studentsPages: {
      btech: String,
      mtech: String,
      phd: String,
    },
    researchPages: { type: [String], default: [] },
    galleryPages: { type: [String], default: [] },
    formsPages: { type: [String], default: [] },
  },
  { timestamps: true }
);

NitgoaDepartmentSchema.index({ slug: 1 });

export default models.NitgoaDepartment ??
  model<INitgoaDepartment>("NitgoaDepartment", NitgoaDepartmentSchema);

