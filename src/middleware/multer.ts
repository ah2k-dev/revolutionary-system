import { Request, Response, NextFunction } from "express";
import path from "path";
import multer, { MulterError } from "multer";
import ErrorHandler from "../utils/ErrorHandler";

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: Function
  ) {
    cb(null, "uploads/");
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    console.log(req.file);

    const timeStamp = Date.now();
    const uniqueSuffix = `${timeStamp}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const filesAllowed: string[] = [".png", ".jpeg", ".jpg"];
const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const ext = path.extname(file.originalname);
  if (!filesAllowed.includes(ext)) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB in bytes
  fileFilter: fileFilter,
});

const singleUpload = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err: Error | string) => {
      console.log(req.file);

      if (err instanceof multer.MulterError) {
        return ErrorHandler("Multer error", 400, req, res);
      } else if (err) {
        return ErrorHandler("Something went wrong!", 400, req, res);
      }
      next();
    });
  };
};
const multipleUpload = (fieldName: string, maxCount: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.array(fieldName, maxCount)(req, res, (err: Error | string) => {
      if (err instanceof multer.MulterError) {
        return ErrorHandler("Multer error", 400, req, res);
      } else if (err) {
        return ErrorHandler("Something went wrong!", 400, req, res);
      }
      next();
    });
  };
};

export { singleUpload, multipleUpload };