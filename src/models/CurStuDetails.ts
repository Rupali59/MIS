import mongoose, { Schema, model, models } from "mongoose";

export interface ICurStuDetails {
  _id: mongoose.Types.ObjectId;
  misId: number;
  dept: string;
  yearOfJoin: string;
  sem: number;
  specialization?: string;
  degree: string;
}

const schema = new Schema<ICurStuDetails>(
  {
    misId: { type: Number, required: true },
    dept: { type: String, required: true },
    yearOfJoin: { type: String, required: true },
    sem: { type: Number, required: true },
    specialization: String,
    degree: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.CurStuDetails ?? model<ICurStuDetails>("CurStuDetails", schema);
