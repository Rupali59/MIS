import mongoose, { Schema, model, models } from "mongoose";

export interface INitgoaResearchItem {
  _id: mongoose.Types.ObjectId;
  type: string;
  title: string;
  url: string;
  departmentId?: mongoose.Types.ObjectId | null;
}

const NitgoaResearchItemSchema = new Schema<INitgoaResearchItem>(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "NitgoaDepartment" },
  },
  { timestamps: true }
);

export default models.NitgoaResearchItem ??
  model<INitgoaResearchItem>("NitgoaResearchItem", NitgoaResearchItemSchema);

