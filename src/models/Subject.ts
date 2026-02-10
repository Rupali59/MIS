import mongoose, { Schema, model, models } from "mongoose";

export interface ISubject {
  _id: mongoose.Types.ObjectId;
  c_id: string;
  c_name: string;
  degree: string;
  dept: string;
  semester: number;
  subject_type?: string;
  elective?: string;
  credits: number;
}

const schema = new Schema<ISubject>(
  {
    c_id: { type: String, required: true },
    c_name: { type: String, required: true },
    degree: { type: String, required: true },
    dept: { type: String, required: true },
    semester: { type: Number, required: true },
    subject_type: String,
    elective: String,
    credits: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.Subject ?? model<ISubject>("Subject", schema);
