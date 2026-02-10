import mongoose, { Schema, model, models } from "mongoose";

export interface IPayment {
  _id: mongoose.Types.ObjectId;
  misId: number;
  ddno: string;
  type: string;
  date: string;
  amt: string;
  late?: string;
  receiptNo: number;
}

const schema = new Schema<IPayment>(
  {
    misId: { type: Number, required: true },
    ddno: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    amt: { type: String, required: true },
    late: String,
    receiptNo: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.Payment ?? model<IPayment>("Payment", schema);
