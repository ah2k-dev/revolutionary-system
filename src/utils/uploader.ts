import multer from "multer";
import { Express, Request } from "express";
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  dest: "uploads/",
  // limits: { fileSize: 2 * 1024 * 1024 }, // 2MB in bytes
});

export default upload;
