export interface RegisterUserRequest{
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
}

export interface VerifyEmailRequest{
    email: string;
    emailVerificationToken: number;

}