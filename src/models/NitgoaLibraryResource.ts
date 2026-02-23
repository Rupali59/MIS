import mongoose, { Schema, model, models } from "mongoose";

export interface INitgoaLibraryResource {
  _id: mongoose.Types.ObjectId;
  type: string;
  title: string;
  url: string;
  category?: string | null;
}

const NitgoaLibraryResourceSchema = new Schema<INitgoaLibraryResource>(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    category: { type: String, default: null },
  },
  { timestamps: true }
);

export default models.NitgoaLibraryResource ??
  model<INitgoaLibraryResource>("NitgoaLibraryResource", NitgoaLibraryResourceSchema);

