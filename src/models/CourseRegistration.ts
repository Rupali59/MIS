import mongoose, { Schema, model, models } from "mongoose";

export interface ICourseRegistration {
  _id: mongoose.Types.ObjectId;
  misId: number;
  sem: number;
  courseIds?: string[];
}

const schema = new Schema<ICourseRegistration>(
  {
    misId: { type: Number, required: true },
    sem: { type: Number, required: true },
    courseIds: [String],
  },
  { timestamps: true }
);

export default models.CourseRegistration ?? model<ICourseRegistration>("CourseRegistration", schema);
