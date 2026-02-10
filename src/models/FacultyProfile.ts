import mongoose, { Schema, model, models } from "mongoose";

export interface IFacultyProfile {
  _id: mongoose.Types.ObjectId;
  f_id: number;
  fname: string;
  mname?: string;
  lname: string;
  gender: string;
  dob?: string;
  parent_name?: string;
  parent_ph_no?: string;
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
  blood_grp?: string;
  email_id?: string;
  religion?: string;
  category?: string;
  marital_status?: string;
  nationality?: string;
  photo?: Buffer;
}

const schema = new Schema<IFacultyProfile>(
  {
    f_id: { type: Number, required: true, unique: true },
    fname: { type: String, required: true },
    mname: String,
    lname: { type: String, required: true },
    gender: { type: String, required: true },
    dob: String,
    parent_name: String,
    parent_ph_no: String,
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
    blood_grp: String,
    email_id: String,
    religion: String,
    category: String,
    marital_status: String,
    nationality: String,
    photo: Buffer,
  },
  { timestamps: true }
);

export default models.FacultyProfile ?? model<IFacultyProfile>("FacultyProfile", schema);
