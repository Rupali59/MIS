import mongoose, { Schema, model, models } from "mongoose";

export interface ITrainingAttended {
  _id: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  title: string;
  type: string;
  month?: string;
  year?: number;
  location?: string;
  notes?: string;
}

const schema = new Schema<ITrainingAttended>(
  {
    staff: { type: Schema.Types.ObjectId, ref: "StaffMember", required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    month: String,
    year: Number,
    location: String,
    notes: String,
  },
  { timestamps: true }
);

export default models.TrainingAttended ?? model<ITrainingAttended>("TrainingAttended", schema);

