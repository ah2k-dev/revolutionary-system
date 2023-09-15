import  { Request, Response,NextFunction } from 'express';
import User,{UserDocument} from "../models/User/user";
import SuccessHandler from "../utils/SuccessHandler"
import sendMail from '../utils/sendMail'
import ErrorHandler from '../utils/ErrorHandler'
import {RegisterUserRequest,VerifyEmailRequest} from '../types/controller/authController'
declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}
//register
export const register = async (req:Request, res:Response)=> {
  // #swagger.tags = ['auth']
  try {
    const { name, email, password, phone, role } = req.body;
    if (
      !password.match(
        /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/
      )
    ) {
      return ErrorHandler(
        "Password must contain atleast one uppercase letter, one special character and one number",
        400,
        req,
        res
      );
    }
    const user:UserDocument | null = await User.findOne({ email });
    if (user) {
      return ErrorHandler("User already exists", 400, req, res);
    }
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      role,
    });
    newUser.save();
    return SuccessHandler("User created successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//request email verification token
export const requestEmailToken = async (req:Request, res:Response) => {
  // #swagger.tags = ['auth']

  try {
    const { email }: { email: string } = req.body;
    const user:UserDocument | null = await User.findOne({ email });
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    const emailVerificationToken :number = Math.floor(100000 + Math.random() * 900000);
    const emailVerificationTokenExpires:Date = new Date(Date.now() + 10 * 60 * 1000);
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpires = emailVerificationTokenExpires;
    await user.save();
    const message:string = `Your email verification token is ${emailVerificationToken} and it expires in 10 minutes`;
    const subject: string = `Email verification token`;
    await sendMail(email, subject, message);
    return SuccessHandler(
      `Email verification token sent to ${email}`,
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//verify email token
export const verifyEmail = async (req:Request, res:Response)=> {
  // #swagger.tags = ['auth']

  try {
    const { email, emailVerificationToken }:VerifyEmailRequest = req.body;
    const user:UserDocument | null = await User.findOne({ email });
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    if (
      user.emailVerificationToken !== emailVerificationToken ||
      (user.emailVerificationTokenExpires && user.emailVerificationTokenExpires < new Date())
    ) {
      return ErrorHandler("Invalid token", 400, req, res);
    }
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;
    let jwtToken:string = user.getJWTToken();
    await user.save();
    return SuccessHandler("Email verified successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//login
export const login = async (req:Request, res:Response) => {
  // #swagger.tags = ['auth']

  try {
    const { email, password } = req.body;
    const user:UserDocument | null = await User.findOne({ email }).select("+password");
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ErrorHandler("Invalid credentials", 400, req, res);
    }
    if (!user.emailVerified) {
      return ErrorHandler("Email not verified", 400, req, res);
    }
    let jwtToken: string = user.getJWTToken();
    return SuccessHandler("Logged in successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//logout
export const logout = async (req:Request, res:Response) => {
  // #swagger.tags = ['auth']

  try {
    req.user = null;
    return SuccessHandler("Logged out successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//forgot password
export const forgotPassword = async (req:Request, res:Response) => {
  // #swagger.tags = ['auth']

  try {
    const { email } = req.body;
    const user:UserDocument | null = await User.findOne({ email });
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    const passwordResetToken = Math.floor(100000 + Math.random() * 900000);
    const passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetToken = passwordResetToken;
    user.passwordResetTokenExpires = passwordResetTokenExpires;
    await user.save();
    const message = `Your password reset token is ${passwordResetToken} and it expires in 10 minutes`;
    const subject = `Password reset token`;
    await sendMail(email, subject, message);
    return SuccessHandler(`Password reset token sent to ${email}`, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//reset password
export const resetPassword = async (req:Request, res:Response) => {
  // #swagger.tags = ['auth']

  try {
    const { email, passwordResetToken, password } = req.body;
    const user:UserDocument | null = await User.findOne({ email }).select("+password");
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    if (
      user.passwordResetToken !== passwordResetToken ||
      (user.passwordResetTokenExpires) < new Date()
    ) {
      return ErrorHandler("Invalid token", 400, req, res);
    }
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();
    return SuccessHandler("Password reset successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//update password
export const updatePassword = async (req:Request, res:Response) => {
  // #swagger.tags = ['auth']
  try {
    const { currentPassword, newPassword } = req.body;
    if (
      !newPassword.match(
        /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/
      )
    ) {
      return ErrorHandler(
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character",
        400,
        req,
        res
      );
    }
    const user:UserDocument | null = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ErrorHandler("Invalid credentials", 400, req, res);
    }
    const samePasswords = await user.comparePassword(newPassword);
    if (samePasswords) {

      return ErrorHandler(
        "New password cannot be same as old password",
        400,
        req,
        res
      );
    }
    user.password = newPassword;
    await user.save();
    return SuccessHandler("Password updated successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

