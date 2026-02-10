import mongoose, { Schema, model, models } from "mongoose";

export interface IExam {
  _id: mongoose.Types.ObjectId;
  roll_no: string;
  c_id: string;
  grade?: string;
  [key: string]: unknown;
}

const schema = new Schema<IExam>(
  {
    roll_no: { type: String, required: true },
    c_id: { type: String, required: true },
    grade: String,
  },
  { timestamps: true, strict: false }
);

export default models.Exam ?? model<IExam>("Exam", schema);
