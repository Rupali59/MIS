import mongoose, { Schema, model, models } from "mongoose";

export interface IStaffQualification {
  _id: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  degree: string;
  discipline: string;
  institute: string;
  university?: string;
  yearOfCompletion?: number;
  thesisTitle?: string;
}

const schema = new Schema<IStaffQualification>(
  {
    staff: { type: Schema.Types.ObjectId, ref: "StaffMember", required: true },
    degree: { type: String, required: true },
    discipline: { type: String, required: true },
    institute: { type: String, required: true },
    university: String,
    yearOfCompletion: Number,
    thesisTitle: String,
  },
  { timestamps: true }
);

export default models.StaffQualification ?? model<IStaffQualification>("StaffQualification", schema);

