export interface SupplierProfileCreateRequest{
    profilePic:string
    dob: Date;
    country: string;
    city: string;
    address: string;
    zipCode: number;
}