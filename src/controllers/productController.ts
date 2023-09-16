import  { Request, Response } from 'express';
import User from "../models/User/user";
import Product from '../models/Supplier/products'
import { ProductDocument } from '../types/models/Supplier/products.types';
import { UserDocument } from '../types/models/User/user.types';
import SuccessHandler from "../utils/SuccessHandler"
import ErrorHandler from '../utils/ErrorHandler'
import {CreateProductRequest} from '../types/controller/productController.types'
import slugify from 'slugify';



declare global {
  namespace Express {
    interface Request {
      product?: ProductDocument; 
    }
  }
}

//create product
const createProduct = async (req:Request, res:Response)=> {
    // #swagger.tags = ['supplier']
    // TODO images
    const currentUser:string = req.user._id
    try {
      const { 
        title,
        desc,
        brand,
        images,
        category,
        price,
        quantity,
        itemWeight,
        size,
        sku,
      }:CreateProductRequest = req.body;
     
      const user:UserDocument | null = await User.findById(currentUser);
      if (!user) {
        return ErrorHandler("User doesn't exist", 400, req, res);
      }
    // create a slug from the title
      const slug = slugify(title, {
        replacement: '-',      
        lower: true,           
        strict: false,       
        trim: true,            
        remove: /[^a-zA-Z0-9\s]/g,
      });
      const product = await Product.create({
        supplier: currentUser,
        slug,
        title,
        desc,
        brand,
        images,
        category,
        price,
        quantity,
        itemWeight,
        size,
        sku,
      });
      return SuccessHandler({message:"Product created successfully",product}, 200, res);
    } catch (error) {
      return ErrorHandler(error.message, 500, req, res);
    }
  };


  export {
    createProduct,
  }
