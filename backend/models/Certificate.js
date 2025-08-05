import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    issuerAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentEmail: { type: String, required: true },
    studentName: { type: String, required: true },
    courseName: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    uniqueId: { type: String, required: true, unique: true },
    hash: { type: String, required: true },

    // ✅ Store both formats
    imageLink: { type: String }, // PNG path (preview or quick view)
    pdfLink: { type: String },   // PDF path (official certificate)

    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
