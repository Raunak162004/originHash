import express from "express";
import { loginAdminOrSuperAdmin } from "../controller/adminController.js";

// import { verifySuperAdmin } from "../middlewares/verifySuperAdmin.js";

const router = express.Router();

router.post("/login", loginAdminOrSuperAdmin);



export default router;