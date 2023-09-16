import  { Request, Response } from 'express';
import Supplier from "../models/User/supplierProfile";
import User from "../models/User/user";
import { SupplierProfileDocument } from '../types/models/User/supplierProfile.types';
import { UserDocument } from '../types/models/User/user.types';
import SuccessHandler from "../utils/SuccessHandler"
import ErrorHandler from '../utils/ErrorHandler'
import {SupplierProfileRequest} from '../types/controller/supplierController.types'
declare global {
  namespace Express {
    interface Request {
      supplier?: SupplierProfileDocument; 
    }
  }
}

//create profile
const createProfile = async (req:Request, res:Response)=> {
    // #swagger.tags = ['supplier']
    const currentUser:string = req.user._id
    try {
      const { 
        dob,
        country,
        city,
        address,
        zipCode,
      }:SupplierProfileRequest = req.body;
     
      const user:UserDocument | null = await User.findById(currentUser);
      if (!user) {
        return ErrorHandler("User doesn't exist", 400, req, res);
      }
      const profile = await Supplier.create({
        user: currentUser,
        dob,
        country,
        city,
        address,
        zipCode,
      });
      return SuccessHandler({message:"Profile created successfully",profile}, 200, res);
    } catch (error) {
      return ErrorHandler(error.message, 500, req, res);
    }
  };

  export {createProfile}
