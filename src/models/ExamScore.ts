import mongoose, { Schema, model, models } from "mongoose";

export interface IExamScore {
  _id: mongoose.Types.ObjectId;
  roll_no: string;
  sem: number;
  [key: string]: unknown;
}

const schema = new Schema<IExamScore>(
  {
    roll_no: { type: String, required: true },
    sem: { type: Number, required: true },
  },
  { timestamps: true, strict: false }
);

export default models.ExamScore ?? model<IExamScore>("ExamScore", schema);
