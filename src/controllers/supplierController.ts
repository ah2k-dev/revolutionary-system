import { Request, Response } from "express";
import Profile from "../models/User/profile";
import User from "../models/User/user";
import { ProfileDocument } from "../types/models/User/profile.types";
import { UserDocument } from "../types/models/User/user.types";
import SuccessHandler from "../utils/SuccessHandler";
import ErrorHandler from "../utils/ErrorHandler";
import { SupplierProfileRequest } from "../types/controller/supplierController.types";
// import { singleUpload } from "../middleware/multer";
import { upload } from "../middleware/multer";
import multer, { MulterError } from "multer";

declare global {
  namespace Express {
    interface Request {
      profile?: ProfileDocument;
    }
  }
}

//create profile
const createProfile = async (req: Request, res: Response) => {
  // #swagger.tags = ['supplier']
  const currentUser: string = req.user._id;
  try {
    const { dob, country, city, address, zipCode }: SupplierProfileRequest =
      req.body;
    console.log(req.body);
    // const { profilePic }: { profilePic: File } = req.file;
    const user: UserDocument | null = await User.findById(currentUser);
    if (!user) {
      return ErrorHandler("User doesn't exist", 400, req, res);
    }
    const isProfile: ProfileDocument | null = await Profile.findOne({
      user: currentUser,
    });
    if (isProfile) {
      return ErrorHandler(
        "Profile already exist. Update instead of creating new",
        400,
        req,
        res
      );
    }

    let profilePic;
    let profileImgFile;
    // if (req.file) {
    console.log(req.file);

    // singleUpload("profilePic");

    upload.single("profilePic")(req, res, (err: Error | string) => {
      console.log("req.file");
      console.log(req.file);

      if (err instanceof multer.MulterError) {
        return ErrorHandler(err.message, 400, req, res);
      } else if (err) {
        return ErrorHandler("Something went wrong!", 400, req, res);
      }
    });
    profilePic = req.file ? req.file.filename : null;
    profileImgFile = `/uploads/${profilePic}`;
    // }

    // if (req.file) {
    //   singleUpload("profilePic")(req, res, () => {
    //     profilePic = req.file ? req.file.filename : null;
    //     profileImgFile = `/uploads/${profilePic}`;
    //   });
    // }

    // console.log("profilePic: ", profilePic);
    // console.log("profileImgFile: ", profileImgFile);
    // const profilePic = req.file ? req.file.filename : null;
    const profile = await Profile.create({
      user: currentUser,
      profilePic,
      dob,
      country,
      city,
      address,
      zipCode,
    });
    return SuccessHandler(
      { message: "Profile created successfully", profile },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
//Update profile
const updateProfile = async (req: Request, res: Response) => {
  // #swagger.tags = ['supplier']
  const currentUser: string = req.user._id;
  try {
    const { dob, country, city, address, zipCode }: SupplierProfileRequest =
      req.body;

    const user: UserDocument | null = await User.findById(currentUser);
    if (!user) {
      return ErrorHandler("User doesn't exist", 400, req, res);
    }
    const updatedProfile = await Profile.findOneAndUpdate(
      {
        user: currentUser,
      },
      {
        $set: {
          // profilePic,
          dob,
          country,
          city,
          address,
          zipCode,
        },
      }
    );
    return SuccessHandler(
      { message: "Profile updated successfully", updatedProfile },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

export { createProfile, updateProfile };
