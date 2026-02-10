import mongoose, { Schema, model, models } from "mongoose";

export interface IMonthlySal {
  _id: mongoose.Types.ObjectId;
  f_id: number;
  month: number;
  year: number;
  amount: number;
}

const schema = new Schema<IMonthlySal>(
  {
    f_id: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.MonthlySal ?? model<IMonthlySal>("MonthlySal", schema);
