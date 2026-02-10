import mongoose, { Schema, model, models } from "mongoose";

export interface IStudentQualifyingExam {
  _id: mongoose.Types.ObjectId;
  misId: number;
  examName: string;
  board: string;
  year: string;
  rollNo?: string;
  marks?: string;
  maxMarks?: string;
  percentage?: string;
  [key: string]: unknown;
}

const schema = new Schema<IStudentQualifyingExam>(
  {
    misId: { type: Number, required: true },
    examName: String,
    board: String,
    year: String,
    rollNo: String,
    marks: String,
    maxMarks: String,
    percentage: String,
  },
  { timestamps: true }
);

export default models.StudentQualifyingExam ?? model<IStudentQualifyingExam>("StudentQualifyingExam", schema);
