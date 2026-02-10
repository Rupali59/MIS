import mongoose, { Schema, model, models } from "mongoose";

export interface ISalaryFix {
  _id: mongoose.Types.ObjectId;
  fac_desg: string;
  fac_sal: number;
}

const schema = new Schema<ISalaryFix>(
  {
    fac_desg: { type: String, required: true },
    fac_sal: { type: Number, required: true },
  },
  { timestamps: true }
);

export default models.SalaryFix ?? model<ISalaryFix>("SalaryFix", schema);
