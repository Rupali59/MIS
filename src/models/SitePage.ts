import mongoose, { Schema, model, models } from "mongoose";

export interface ISitePageMetadata {
  crawledAt?: Date;
  lastSeen?: Date;
  contentType?: string;
  statusCode?: number;
}

export interface ISitePageParsedFlags {
  facultyParsed?: boolean;
  programParsed?: boolean;
  formsParsed?: boolean;
  libraryParsed?: boolean;
  researchParsed?: boolean;
}

export interface ISitePage {
  _id: mongoose.Types.ObjectId;
  url: string;
  path: string;
  domain: string;
  section?: string | null;
  subSection?: string | null;
  title?: string | null;
  h1?: string | null;
  text: string;
  metadata?: ISitePageMetadata;
  parsedFlags?: ISitePageParsedFlags;
}

const SitePageSchema = new Schema<ISitePage>(
  {
    url: { type: String, required: true, unique: true },
    path: { type: String, required: true },
    domain: { type: String, required: true },
    section: { type: String, default: null },
    subSection: { type: String, default: null },
    title: { type: String, default: null },
    h1: { type: String, default: null },
    text: { type: String, required: true },
    metadata: {
      crawledAt: Date,
      lastSeen: Date,
      contentType: String,
      statusCode: Number,
    },
    parsedFlags: {
      facultyParsed: Boolean,
      programParsed: Boolean,
      formsParsed: Boolean,
      libraryParsed: Boolean,
      researchParsed: Boolean,
    },
  },
  { timestamps: true }
);

SitePageSchema.index({ path: 1 });
SitePageSchema.index({ section: 1, subSection: 1 });

export default models.SitePage ?? model<ISitePage>("SitePage", SitePageSchema);

