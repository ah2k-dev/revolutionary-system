const User = require("../models/User/user");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const Accomodation = require("../models/Accomodation/accomodation");


// get Current user
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



// get Current user
const savedOrUnsavedAccomodation = async (req, res) => {
  // #swagger.tags = ['user']
    try {
  const currentUser = req.user._id
  if (req.user.role === "user") {
    const accommodation = await Accomodation.findById(req.params.id)
    const user = await User.findById(currentUser)

    if (!accommodation) {
      return ErrorHandler("Accommodation does not exist", 400, req, res);
    }

    // if saved => remove id from user model and mark as unsaved
    if (user.savedAccomodation.includes(accommodation)) {
      const index = user.savedAccomodation.indexOf(currentUser)
      user.savedAccomodation.splice(index,1)
      await user.save()
      return SuccessHandler("Saved Accomodation Successfully", 200, res);
      
    }

    else{
      user.savedAccomodation.push(currentUser)
      return SuccessHandler("Unsaved Accomodation", 200, res);
    }



    
  }

  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


module.exports = {
  updateUser,
  getAllUsers,
  getUserProfile,
  savedOrUnsavedAccomodation,
};
