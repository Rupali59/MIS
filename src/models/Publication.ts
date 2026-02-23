import mongoose, { Schema, model, models } from "mongoose";

export type PublicationType = "Journal" | "Conference" | "Book" | "BookChapter" | "Patent" | "Other";

export interface IPublication {
  _id: mongoose.Types.ObjectId;
  staff: mongoose.Types.ObjectId;
  type: PublicationType;
  category?: "International" | "National";
  title: string;
  authors: string;
  venue: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
}

const schema = new Schema<IPublication>(
  {
    staff: { type: Schema.Types.ObjectId, ref: "StaffMember", required: true },
    type: {
      type: String,
      required: true,
      enum: ["Journal", "Conference", "Book", "BookChapter", "Patent", "Other"],
    },
    category: { type: String, enum: ["International", "National"] },
    title: { type: String, required: true },
    authors: { type: String, required: true },
    venue: { type: String, required: true },
    year: { type: Number, required: true },
    volume: String,
    issue: String,
    pages: String,
    doi: String,
    url: String,
  },
  { timestamps: true }
);

export default models.Publication ?? model<IPublication>("Publication", schema);

