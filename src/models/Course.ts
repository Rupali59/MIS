import mongoose, { Schema, model, models } from "mongoose";

export interface ICourse {
  _id: mongoose.Types.ObjectId;
  code: string;
  title: string;
  level: "UG" | "PG";
  credits?: number;
  department: string;
}

const schema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    level: { type: String, required: true, enum: ["UG", "PG"] },
    credits: Number,
    department: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Course ?? model<ICourse>("Course", schema);

