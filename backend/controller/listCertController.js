import Certificate from "../models/Certificate.js";

// 🟢 Get all certificates issued by the logged-in admin
export const listMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ issuerAdminId: req.user._id })
      .populate("issuerAdminId", "name email role");

    res.json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (err) {
    console.error("Error listing my certificates:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🟢 Get all certificates (SuperAdmin only)
export const listAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("issuerAdminId", "name email role");

    res.json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (err) {
    console.error("Error listing all certificates:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
