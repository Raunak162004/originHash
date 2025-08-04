import express from "express";
import { loginAdminOrSuperAdmin } from "../controller/adminController.js";
import { uploadVideo } from "../controller/videoController.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";
import upload from "../middlewares/upload.js";

// import { verifySuperAdmin } from "../middlewares/verifySuperAdmin.js";

const router = express.Router();

router.post("/login", loginAdminOrSuperAdmin);
router.post('/upload', verifyAdmin, upload.single('video'), uploadVideo);



export default router;