import mongoose, { Schema, model, models } from "mongoose";

export interface IMisRoll {
  _id: mongoose.Types.ObjectId;
  misId: number;
  roll_no: string;
}

const schema = new Schema<IMisRoll>(
  {
    misId: { type: Number, required: true },
    roll_no: { type: String, required: true },
  },
  { timestamps: true }
);

schema.index({ misId: 1 }, { unique: true });
schema.index({ roll_no: 1 }, { unique: true });

export default models.MisRoll ?? model<IMisRoll>("MisRoll", schema);
