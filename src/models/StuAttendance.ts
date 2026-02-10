import mongoose, { Schema, model, models } from "mongoose";

export interface IStuAttendance {
  _id: mongoose.Types.ObjectId;
  f_id: number;
  c_id: string;
  roll_no: string;
  date: string;
  presence: string;
}

const schema = new Schema<IStuAttendance>(
  {
    f_id: { type: Number, required: true },
    c_id: { type: String, required: true },
    roll_no: { type: String, required: true },
    date: { type: String, required: true },
    presence: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.StuAttendance ?? model<IStuAttendance>("StuAttendance", schema);
