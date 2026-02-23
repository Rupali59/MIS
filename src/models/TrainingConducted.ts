import mongoose, { Schema, model, models } from "mongoose";

export interface ITrainingConducted {
  _id: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  title: string;
  type: string;
  month?: string;
  year?: number;
  role?: string;
}

const schema = new Schema<ITrainingConducted>(
  {
    staff: { type: Schema.Types.ObjectId, ref: "StaffMember", required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    month: String,
    year: Number,
    role: String,
  },
  { timestamps: true }
);

export default models.TrainingConducted ?? model<ITrainingConducted>("TrainingConducted", schema);

