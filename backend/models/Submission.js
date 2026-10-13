import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  type: { type: String, enum: ["contact", "feedback", "requirement"], required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);
