import {Request, Response, NextFunction} from 'express'
import logger from '../functions/logger';

export default (req:Request, res:Response, next:NextFunction) => {
  logger.info({
    method: req.method,
    url: req.url,
    date: new Date(),
    message: "Request received",
  });
  next();
};
