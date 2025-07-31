// controllers/adminController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const loginAdminOrSuperAdmin = async (req, res) => {
  const { username, password, userId, password1, password2 } = req.body;

  try {
    let user;

    // SuperAdmin login
    if (userId && password1 && password2) {
      user = await Admin.findOne({ userId, isSuperAdmin: true });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const pass1Match = password1 === user.password1;
      const pass2Match = password2 === user.password2;
      if (!pass1Match || !pass2Match)
        return res.status(401).json({ message: "Invalid credentials" });

    } else if (username && password) {
      // Admin login
      // console.log(username);
      user = await Admin.findOne({ username, isSuperAdmin: false });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      console.log("idhar tak aaya");

      const passMatch = password === user.password;
      if (!passMatch)
        return res.status(401).json({ message: "Invalid credentials" });
    } else {
      return res.status(400).json({ message: "Incomplete login credentials" });
    }

    const token = jwt.sign({ id: user._id, isSuperAdmin: user.isSuperAdmin }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      isSuperAdmin: user.isSuperAdmin,
    });

  } catch (err) {
    console.error("Admin Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
