import { v4 as uuidv4 } from "uuid";
import { generateHash } from "../utils/hashUtil.js";
import { generateCertificate } from "../utils/generateCert.js";
import { sendCertificateEmail } from "../utils/email.js";
import Certificate from "../models/Certificate.js";
import fs from "fs";

export const previewCertificate = async (req, res) => { 
  try {
    const { studentName, courseName, issueDate, expiryDate } = req.body;
    const uniqueId = uuidv4();

    const preview = await generateCertificate(
      { studentName, courseName, issueDate, expiryDate, uniqueId },
      true
    );

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Generate unique query param
    const previewToken = uuidv4();

    const previewLink = `${baseUrl}${preview.pngPath}?previewId=${previewToken}`;
    const pdfPreview = `${baseUrl}${preview.pdfPath}?previewId=${previewToken}`;

    res.json({
      success: true,
      previewLink,
      pdfPreview,
      previewId: previewToken  // optional: return for debugging
    });

    // Auto-delete after 5 minutes
    setTimeout(() => {
      try {
        if (fs.existsSync(preview.pngPath)) fs.unlinkSync(preview.pngPath);
        if (fs.existsSync(preview.pdfPath)) fs.unlinkSync(preview.pdfPath);
        console.log(`🗑️ Preview files deleted: ${preview.pngPath}, ${preview.pdfPath}`);
      } catch (err) {
        console.error("Auto-delete error:", err.message);
      }
    }, 5 * 60 * 1000);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const issueCertificate = async (req, res) => {
  try {
    const { studentEmail, studentName, courseName, issueDate, expiryDate } = req.body;
    const issuerAdminId = req.user.id;

    const uniqueId = uuidv4();
    const hash = generateHash(studentEmail + courseName + uniqueId);

    // ✅ Generate both PNG & PDF
    const { pngPath, pdfPath } = await generateCertificate({
      studentName,
      courseName,
      issueDate,
      expiryDate,
      uniqueId
    });

    // ✅ Save certificate in DB
    const cert = new Certificate({
      issuerAdminId,
      studentEmail,
      studentName,
      courseName,
      issueDate,
      expiryDate,
      uniqueId,
      hash,
      imageLink: pngPath,
      pdfLink: pdfPath,
    });

    await cert.save();

    // ✅ Send certificate email to student
    await sendCertificateEmail(
      studentEmail,
      "Your Course Certificate",
      "Congratulations! 🎉 Please find your OriginHash certificate attached.",
      pdfPath
    );

    // ✅ Send certificate data to frontend (admin can download)
    res.json({
      success: true,
      message: "Certificate issued successfully",
      certificate: {
        id: cert._id,
        studentEmail: cert.studentEmail,
        studentName: cert.studentName,
        courseName: cert.courseName,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        uniqueId: cert.uniqueId,
        hash: cert.hash,
        pngUrl: pngPath,
        pdfUrl: pdfPath
      }
    });

  } catch (err) {
    console.error("Certificate Issue Error:", err);
    res.status(500).json({ error: err.message });
  }
};
