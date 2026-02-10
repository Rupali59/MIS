import mongoose, { Schema, model, models } from "mongoose";

export interface IFacultyQualifyingExam {
  _id: mongoose.Types.ObjectId;
  f_id: number;
  [key: string]: unknown;
}

const schema = new Schema<IFacultyQualifyingExam>(
  {
    f_id: { type: Number, required: true },
  },
  { timestamps: true, strict: false }
);

export default models.FacultyQualifyingExam ?? model<IFacultyQualifyingExam>("FacultyQualifyingExam", schema);
