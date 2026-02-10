import mongoose, { Schema, model, models } from "mongoose";

export interface IStudentProfile {
  _id: mongoose.Types.ObjectId;
  misId: number;
  fname: string;
  mname?: string;
  lname: string;
  dob: string;
  gender: string;
  faname?: string;
  focc?: string;
  moname?: string;
  mocc?: string;
  phno?: string;
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
  mno?: string;
  lno?: string;
  bloodGrp?: string;
  email?: string;
  religion?: string;
  category?: string;
  maritalStatus?: string;
  nationality?: string;
  photo?: Buffer;
}

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    misId: { type: Number, required: true, unique: true },
    fname: { type: String, required: true },
    mname: String,
    lname: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    faname: String,
    focc: String,
    moname: String,
    mocc: String,
    phno: String,
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
    mno: String,
    lno: String,
    bloodGrp: String,
    email: String,
    religion: String,
    category: String,
    maritalStatus: String,
    nationality: String,
    photo: Buffer,
  },
  { timestamps: true }
);

export default models.StudentProfile ?? model<IStudentProfile>("StudentProfile", studentProfileSchema);
