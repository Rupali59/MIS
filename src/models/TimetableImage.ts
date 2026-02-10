import mongoose, { Schema, model, models } from "mongoose";

export interface ITimetableImage {
  _id: mongoose.Types.ObjectId;
  f_id: number;
  image: Buffer;
  contentType?: string;
}

const schema = new Schema<ITimetableImage>(
  {
    f_id: { type: Number, required: true },
    image: { type: Buffer, required: true },
    contentType: String,
  },
  { timestamps: true }
);

export default models.TimetableImage ?? model<ITimetableImage>("TimetableImage", schema);
