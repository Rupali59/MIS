import mongoose, { Schema, model, models } from "mongoose";

export type StaffCategory = "faculty" | "technical" | "administrative";

export interface IStaffMember {
  _id: mongoose.Types.ObjectId;
  staffId: string;
  category: StaffCategory;
  firstName: string;
  middleName?: string;
  lastName: string;
  title?: string;
  gender?: string;
  dateOfBirth?: string;
  designation: string;
  department: string;
  isHeadOfDepartment?: boolean;
  dateOfJoining?: string;

  emailOfficial: string;
  emailPersonal?: string;
  phoneOffice?: string;
  phoneMobile?: string;
  officeRoom?: string;
  officeAddress?: string;

  totalTeachingExpYears?: number;
  totalResearchExpYears?: number;

  researchAreas?: string[];
  homepageUrl?: string;
  googleScholarId?: string;
  orcidId?: string;
}

const staffSchema = new Schema<IStaffMember>(
  {
    staffId: { type: String, required: true, unique: true },
    category: { type: String, required: true, enum: ["faculty", "technical", "administrative"] },
    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String, required: true },
    title: String,
    gender: String,
    dateOfBirth: String,
    designation: { type: String, required: true },
    department: { type: String, required: true },
    isHeadOfDepartment: Boolean,
    dateOfJoining: String,
    emailOfficial: { type: String, required: true },
    emailPersonal: String,
    phoneOffice: String,
    phoneMobile: String,
    officeRoom: String,
    officeAddress: String,
    totalTeachingExpYears: Number,
    totalResearchExpYears: Number,
    researchAreas: [String],
    homepageUrl: String,
    googleScholarId: String,
    orcidId: String,
  },
  { timestamps: true }
);

export default models.StaffMember ?? model<IStaffMember>("StaffMember", staffSchema);

