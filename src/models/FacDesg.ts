import mongoose, { Schema, model, models } from "mongoose";

export interface IFacDesg {
  _id: mongoose.Types.ObjectId;
  f_id: number;
  desg: string;
}

const schema = new Schema<IFacDesg>(
  {
    f_id: { type: Number, required: true },
    desg: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.FacDesg ?? model<IFacDesg>("FacDesg", schema);
