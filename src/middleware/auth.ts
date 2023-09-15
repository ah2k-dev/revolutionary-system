import {Request, Response, NextFunction} from 'express'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User/user";
dotenv.config({ path: ".././src/config/config.env" });
import type { JwtPayload } from "jsonwebtoken"
const isAuthenticated = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const token:string = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default isAuthenticated;
