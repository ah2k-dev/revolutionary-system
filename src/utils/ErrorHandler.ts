import {Request, Response} from "express"
import logger from "../functions/logger";

const ErrorHandler = (message:string, statusCode:number, req:Request, res:Response) => {
  logger.error({
    method: req.method,
    url: req.url,
    date: new Date(),
    message: message,
  });
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default ErrorHandler