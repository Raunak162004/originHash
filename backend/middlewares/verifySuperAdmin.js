// middlewares/verifySuperAdmin.js
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const verifySuperAdmin = async (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || !admin.isSuperAdmin) {
      return res.status(403).json({ message: "Only SuperAdmin allowed" });
    }

    req.user = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
