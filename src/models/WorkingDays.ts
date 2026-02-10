import mongoose, { Schema, model, models } from "mongoose";

export interface IWorkingDays {
  _id: mongoose.Types.ObjectId;
  no_of_working_day: number;
  total_days: number;
  month?: number;
  year?: number;
}

const schema = new Schema<IWorkingDays>(
  {
    no_of_working_day: { type: Number, required: true },
    total_days: { type: Number, required: true },
    month: Number,
    year: Number,
  },
  { timestamps: true }
);

export default models.WorkingDays ?? model<IWorkingDays>("WorkingDays", schema);
