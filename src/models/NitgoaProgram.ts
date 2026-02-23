import mongoose, { Schema, model, models } from "mongoose";

export interface INitgoaProgram {
  _id: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId | null;
  level: string;
  name: string;
  batch?: number | null;
  handbookUrl?: string | null;
  syllabusUrls?: string[];
  regulationUrls?: string[];
}

const NitgoaProgramSchema = new Schema<INitgoaProgram>(
  {
    departmentId: { type: Schema.Types.ObjectId, ref: "NitgoaDepartment" },
    level: { type: String, required: true },
    name: { type: String, required: true },
    batch: { type: Number, default: null },
    handbookUrl: { type: String, default: null },
    syllabusUrls: { type: [String], default: [] },
    regulationUrls: { type: [String], default: [] },
  },
  { timestamps: true }
);

NitgoaProgramSchema.index(
  { departmentId: 1, level: 1, batch: 1, name: 1 },
  { unique: true }
);

export default models.NitgoaProgram ??
  model<INitgoaProgram>("NitgoaProgram", NitgoaProgramSchema);

