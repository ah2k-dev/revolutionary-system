const User = require("../models/User/user");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");




// get all users 
const getUserProfile = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    return SuccessHandler({message: "Here you go", user}, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};



//update user
const updateUser = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const {
      username,
      websiteLink,
      userDesc,
      country,
      timeZone,
    } = req.body;

  

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        username,
        websiteLink,
        userDesc,
        country,
        timeZone,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    return SuccessHandler(
      { message: "Update Info successfully", user },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


// random end point to test authorized middleware
// get all users 
const getAllUsers = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const user = await User.find()
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    return SuccessHandler({message: "Here you go", user}, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


module.exports = {
  updateUser,
  getAllUsers,
  getUserProfile,
};
