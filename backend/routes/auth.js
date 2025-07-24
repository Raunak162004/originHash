import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://origin-hash.vercel.app/",
  }),
  async (req, res) => {
    const { _json } = req.user;
    const { email, name } = _json;

    try {
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.redirect(
          `https://origin-hash.vercel.app/register?error=not_registered`
        );
      }

      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.redirect("https://origin-hash.vercel.app/dashboard");
    } catch (error) {
      console.error("OAuth error:", error);
      res.redirect("https://origin-hash.vercel.app?error=oauth_failed");
    }
  }
);

export default router;