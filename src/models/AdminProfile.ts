import mongoose, { Schema, model, models } from "mongoose";

export interface IAdminProfile {
  _id: mongoose.Types.ObjectId;
  id: number;
  fname: string;
  mname?: string;
  lname: string;
  dob?: string;
  gender?: string;
  p_street?: string;
  p_city?: string;
  p_state?: string;
  p_country?: string;
  p_pincode?: string;
  t_street?: string;
  t_city?: string;
  t_state?: string;
  t_country?: string;
  t_pincode?: string;
  blood_group?: string;
  email_id?: string;
  marital_status?: string;
  nationality?: string;
  mno?: string;
  lno?: string;
}

const schema = new Schema<IAdminProfile>(
  {
    id: { type: Number, required: true, unique: true },
    fname: { type: String, required: true },
    mname: String,
    lname: { type: String, required: true },
    dob: String,
    gender: String,
    p_street: String,
    p_city: String,
    p_state: String,
    p_country: String,
    p_pincode: String,
    t_street: String,
    t_city: String,
    t_state: String,
    t_country: String,
    t_pincode: String,
    blood_group: String,
    email_id: String,
    marital_status: String,
    nationality: String,
    mno: String,
    lno: String,
  },
  { timestamps: true }
);

export default models.AdminProfile ?? model<IAdminProfile>("AdminProfile", schema);
