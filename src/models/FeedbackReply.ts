import mongoose, { Schema, model, models } from "mongoose";

export interface IFeedbackReply {
  _id: mongoose.Types.ObjectId;
  misId: number;
  c_id?: string;
  sem?: number;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  [key: string]: unknown;
}

const schema = new Schema<IFeedbackReply>(
  {
    misId: { type: Number, required: true },
    c_id: String,
    sem: Number,
    q1: String,
    q2: String,
    q3: String,
    q4: String,
    q5: String,
  },
  { timestamps: true, strict: false }
);

export default models.FeedbackReply ?? model<IFeedbackReply>("FeedbackReply", schema);
