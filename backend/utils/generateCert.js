import { createCanvas, registerFont } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Register fonts
const fontDir = path.join(__dirname, "../assets/fonts");
registerFont(path.join(fontDir, "PlayfairDisplay-Bold.ttf"), { family: "Playfair" });
registerFont(path.join(fontDir, "OpenSans-Regular.ttf"), { family: "OpenSans" });

export const generateCertificate = async (details, preview = false) => {
  const { studentName, courseName, issueDate, expiryDate, uniqueId } = details;

  // Canvas size A4 landscape (96 DPI approx)
  const width = 1123;
  const height = 794;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // --- Certificate design ---
  ctx.fillStyle = "#fdf6e3"; // background
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = "#2d3436";
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Branding + Title
  ctx.fillStyle = "#2d3436";
  ctx.textAlign = "center";
  ctx.font = "bold 40px Playfair";
  ctx.fillText("OriginHash", width / 2, 100);

  ctx.font = "bold 55px Playfair";
  ctx.fillText("Certificate of Completion", width / 2, 200);

  ctx.font = "italic 24px OpenSans";
  ctx.fillText("This is proudly presented to", width / 2, 260);

  // Student Name
  ctx.font = "bold 45px Playfair";
  ctx.fillText(studentName, width / 2, 330);

  // Course Name
  ctx.font = "24px OpenSans";
  ctx.fillText("for successfully completing the course", width / 2, 380);

  ctx.font = "bold 32px Playfair";
  ctx.fillText(courseName, width / 2, 430);

  // Dates
  ctx.font = "20px OpenSans";
  ctx.fillText(`Issued on: ${new Date(issueDate).toDateString()}`, width / 2, 500);
  ctx.fillText(`Valid until: ${new Date(expiryDate).toDateString()}`, width / 2, 540);

  // Unique ID
  ctx.font = "16px OpenSans";
  ctx.fillText(`Certificate ID: ${uniqueId}`, width / 2, 600);

  // Signature
  ctx.font = "20px Playfair";
  ctx.fillText("_____________________", width / 2, 660);
  ctx.fillText("Authorized by OriginHash", width / 2, 690);

  // ✅ Ensure uploads folder exists
  const uploadDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // --- Save PNG ---
  const pngFile = preview ? `preview-${Date.now()}.png` : `cert-${uniqueId}.png`;
  const pngPath = path.join(uploadDir, pngFile);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(pngPath, buffer);

  // --- Save PDF (embedding PNG into PDF) ---
  const pdfFile = pngFile.replace(".png", ".pdf");
  const pdfPath = path.join(uploadDir, pdfFile);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    const stream = fs.createWriteStream(pdfPath);

    stream.on("finish", resolve);
    stream.on("error", reject);

    doc.pipe(stream);
    doc.image(buffer, 0, 0, { width: 842, height: 595 }); // scale PNG to A4 landscape
    doc.end();
  });

  // ✅ Return both paths + buffer
  return {
    success: true,
    message: "Certificate generated successfully",
    pngPath,
    pdfPath,
    buffer, // for DB storage if needed
  };
};
