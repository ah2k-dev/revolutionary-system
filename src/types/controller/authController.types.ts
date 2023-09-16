export interface RegisterUserRequest{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: string;
}

export interface UpdatePasswordRequest{
    currentPassword: string;
    newPassword: string;
}

export interface VerifyEmailRequest{
    email: string;
    emailVerificationToken: number;

}

export interface ResetPasswordRequest{
    email: string;
    passwordResetToken: number;
    password: string;
}
