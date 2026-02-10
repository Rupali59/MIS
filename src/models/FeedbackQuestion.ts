import mongoose, { Schema, model, models } from "mongoose";

export interface IFeedbackQuestion {
  _id: mongoose.Types.ObjectId;
  question: string;
}

const schema = new Schema<IFeedbackQuestion>(
  {
    question: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.FeedbackQuestion ?? model<IFeedbackQuestion>("FeedbackQuestion", schema);
