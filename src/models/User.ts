import mongoose, { Schema, model, models } from "mongoose";

export type Role = "student" | "faculty" | "admin";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  misId: number;
  password: string;
  role: Role;
  secQuest?: string;
  secAns?: string;
  hint?: string;
}

const userSchema = new Schema<IUser>(
  {
    misId: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["student", "faculty", "admin"] },
    secQuest: String,
    secAns: String,
    hint: String,
  },
  { timestamps: true }
);

export default models.User ?? model<IUser>("User", userSchema);
