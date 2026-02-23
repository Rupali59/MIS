import mongoose, { Schema, model, models } from "mongoose";

export interface INitgoaFormOrDownload {
  _id: mongoose.Types.ObjectId;
  label: string;
  category: string;
  url: string;
  sourceSection: string;
  description?: string | null;
}

const NitgoaFormOrDownloadSchema = new Schema<INitgoaFormOrDownload>(
  {
    label: { type: String, required: true },
    category: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    sourceSection: { type: String, required: true },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

export default models.NitgoaFormOrDownload ??
  model<INitgoaFormOrDownload>("NitgoaFormOrDownload", NitgoaFormOrDownloadSchema);

