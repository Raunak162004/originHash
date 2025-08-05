import Certificate from "../models/Certificate.js";

// ✅ Step 1: Verify Certificate by ID (before payment)
export const verifyCertificate = async (req, res) => {
  try {
    const { uniqueId } = req.body;

    const cert = await Certificate.findOne({ uniqueId });

    if (!cert) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    // Return certificate info, not verified yet
    res.json({
      success: true,
      message: "Certificate found. Please proceed to payment.",
      cert: {
        studentName: cert.studentName,
        courseName: cert.courseName,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        uniqueId: cert.uniqueId,
        verified: cert.verified,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Step 2: After dummy payment → verify certificate
export const confirmPaymentAndVerify = async (req, res) => {
  try {
    const { uniqueId } = req.body;

    const cert = await Certificate.findOne({ uniqueId });
    if (!cert) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    // Simulate payment success
    cert.verified = true;
    await cert.save();

    res.json({
      success: true,
      message: "Payment successful & certificate verified.",
      cert: {
        studentName: cert.studentName,
        courseName: cert.courseName,
        uniqueId: cert.uniqueId,
        verified: cert.verified,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
