import  { Request, Response } from 'express';
import Supplier from "../models/User/supplierProfile";
import { SupplierProfileDocument } from '../types/models/User/supplierProfile.types';
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
    
    try {
      const { name, email, password, phone, role }:SupplierProfileRequest = req.body;
     
      const supplier:SupplierProfileDocument | null = await Supplier.findOne({ email });
      if (supplier) {
        return ErrorHandler("User already exists", 400, req, res);
      }
      const newUser = await Supplier.create({
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

  export {createProfile}
