import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";

const authorizedSupplier = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if not of 'supplier'
  if (req.user.role !== "supplier") {
    return ErrorHandler(
      `Role: ${req.user.role} is not allowed to access resource`,
      401,
      req,
      res
    );
  }

  next();
};

const authorizedDropshipper = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if not of 'dropshipper'
  if (req.user.role !== "dropshipper") {
    return ErrorHandler(
      `Role: ${req.user.role} is not allowed to access resource`,
      401,
      req,
      res
    );
  }

  next();
};
export { authorizedSupplier, authorizedDropshipper };
