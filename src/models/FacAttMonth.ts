import mongoose, { Schema, model, models } from "mongoose";

export interface IFacAttMonth {
  _id: mongoose.Types.ObjectId;
  f_id: number;
  no_of_days: number;
  month: number;
  year: number;
}

const schema = new Schema<IFacAttMonth>(
  {
    f_id: { type: Number, required: true },
    no_of_days: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.FacAttMonth ?? model<IFacAttMonth>("FacAttMonth", schema);
