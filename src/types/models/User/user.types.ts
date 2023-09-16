import {Document} from 'mongoose'
export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    phone: string;
    emailVerified: boolean;
    emailVerificationToken: number | null;
    emailVerificationTokenExpires: Date | null;
    passwordResetToken: number | null;
    passwordResetTokenExpires: Date;
    lastLogin: Date | null;
    isActive: boolean;
    getJWTToken(): string;
    comparePassword(enteredPassword: string): Promise<boolean>;
  }