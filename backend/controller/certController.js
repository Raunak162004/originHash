import { v4 as uuidv4 } from "uuid";
import { generateHash } from "../utils/hashUtil.js";
import { generateCertificate } from "../utils/generateCert.js";
import { sendCertificateEmail } from "../utils/email.js";
import Certificate from "../models/Certificate.js";

export const previewCertificate = async (req, res) => {
  try {
    const { studentName, courseName, issueDate, expiryDate } = req.body;
    const uniqueId = uuidv4();

    const preview = await generateCertificate(
      { studentName, courseName, issueDate, expiryDate, uniqueId },
      true
    );

    res.json({ success: true, previewLink: preview.pngPath });
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
