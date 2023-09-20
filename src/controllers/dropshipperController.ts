import { Request, Response } from "express";
import Profile from "../models/User/profile";
import User from "../models/User/user";
import { ProfileDocument } from "../types/models/User/profile.types";
import { UserDocument } from "../types/models/User/user.types";
import SuccessHandler from "../utils/SuccessHandler";
import ErrorHandler from "../utils/ErrorHandler";
import { DSProfileRequest } from "../types/controller/dropshipperController.types";
declare global {
  namespace Express {
    interface Request {
      profile?: ProfileDocument;
    }
  }
}

//create profile
const createProfile = async (req: Request, res: Response) => {
  // #swagger.tags = ['dropshipper']
  const currentUser: string = req.user._id;
  try {
    const { dob, country, city, address, zipCode }: DSProfileRequest = req.body;

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
    let profileImage = null;
    // const profilePic = req.file ? req.file.originalname : null;
    if (req.file || req.file.originalname) {
      const timeStamp = Date.now();
      profileImage = `${timeStamp}-${req.file.originalname}`;
    }
    const profile = await Profile.create({
      dropshipper: currentUser,
      profilePic: profileImage,
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
  // #swagger.tags = ['dropshipper']
  const currentUser: string = req.user._id;
  try {
    const { dob, country, city, address, zipCode }: DSProfileRequest = req.body;

    const user: UserDocument | null = await User.findById(currentUser);

    if (!user) {
      return ErrorHandler("User doesn't exist", 400, req, res);
    }
    const prvImage = await Profile.findOne({ dropshipper: currentUser });
    let profileImage = prvImage.profilePic;
    // const profilePic = req.file ? req.file.originalname : null;
    if (req.file || req.file.originalname) {
      const timeStamp = Date.now();
      profileImage = `${timeStamp}-${req.file.originalname}`;
    }
    const updatedProfile = await Profile.findOneAndUpdate(
      {
        dropshipper: currentUser,
      },
      {
        $set: {
          profilePic: profileImage,
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

const getProfile = async (req: Request, res: Response) => {
  // #swagger.tags = ['dropshipper']
  try {
    const profile: ProfileDocument = await Profile.findOne({
      user: req.user._id,
    }).populate({
      path: "user",
    });
    return SuccessHandler(
      { message: "Profile Detail fetched successfully", profile },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

export { createProfile, updateProfile, getProfile };
