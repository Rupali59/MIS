import mongoose, { Schema, model, models } from "mongoose";

export interface IStudentEntranceExam {
  _id: mongoose.Types.ObjectId;
  misId: number;
  examName: string;
  rollNo?: string;
  rank?: string;
  year?: string;
  [key: string]: unknown;
}

const schema = new Schema<IStudentEntranceExam>(
  {
    misId: { type: Number, required: true },
    examName: String,
    rollNo: String,
    rank: String,
    year: String,
  },
  { timestamps: true }
);

export default models.StudentEntranceExam ?? model<IStudentEntranceExam>("StudentEntranceExam", schema);
