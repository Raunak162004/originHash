import express from "express";
import dotenv from "dotenv";
import db from "./utils/db.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// import all routes
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// connect to MongoDB
db();

app.use("/api/v1/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
