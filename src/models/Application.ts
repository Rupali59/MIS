import mongoose, { Schema, model, models } from "mongoose";

export interface IApplication {
  _id: mongoose.Types.ObjectId;
  app_type: string;
  app_to: number;
  app_from: number;
  content: string;
  date: string;
  app_status: string;
}

const schema = new Schema<IApplication>(
  {
    app_type: { type: String, required: true },
    app_to: { type: Number, required: true },
    app_from: { type: Number, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    app_status: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Application ?? model<IApplication>("Application", schema);
