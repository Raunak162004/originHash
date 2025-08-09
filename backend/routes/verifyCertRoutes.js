import express from "express";
import { verifyCertificate, confirmPaymentAndVerify } from "../controller/verifyCertController.js";
import { isLoggedIn } from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

// Step 1: Verify by Certificate ID
router.post("/verify", verifyCertificate);

// Step 2: Dummy Payment → Mark as verified
router.post("/verify/payment", confirmPaymentAndVerify);

export default router;
