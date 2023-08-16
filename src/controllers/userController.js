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
      firstName,
      lastName,
      username,
      websiteLink,
      userDesc,
      country,
      // timeZone,
    } = req.body;

  

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        username,
        websiteLink,
        userDesc,
        country,
        // timeZone,
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



// Saved or Unsaved Accomodation
const savedOrUnsavedAccomodation = async (req, res) => {
  // #swagger.tags = ['user']
    try {
  const currentUser = req.user._id
  if (req.user.role === "user") {
    const accomodation = await Accomodation.findById(req.params.id)
    const user = await User.findById(currentUser)
    console.log("user: ", user);
    console.log("accommodation: ", accomodation);

    if (!accomodation) {
      return ErrorHandler("Accommodation does not exist", 400, req, res);
    }

    // if saved => remove id from user model and mark as unsaved
    if (user.savedAccomodation.includes(accomodation.id)) {
      const index = user.savedAccomodation.indexOf(currentUser)
      user.savedAccomodation.splice(index,1)
      await user.save()
      return SuccessHandler("UnSaved Accomodation Successfully", 200, res);
      
    }
    
    else{
      user.savedAccomodation.push(accomodation.id)
      await user.save()
      return SuccessHandler("Saved Accomodation", 200, res);
    }
    
  }


  // if not user.role ==='user'
  else{
    return ErrorHandler("Unauthorized User", 500, req, res);
  }

  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};




// get Current user
const getSavedAccomodations = async (req, res) => {
  // #swagger.tags = ['user']
    try {
  const currentUser = req.user._id
  if (req.user.role === "user") {
    const user = await User.findById(currentUser).populate('savedAccomodation');

    let sAccomodations = user.savedAccomodation

    // const accomodation = await Accomodation.findById(req.params.id)
    // console.log("user: ", user);
    // console.log("accommodation: ", accomodation);

    if (!sAccomodations) {
      return ErrorHandler("Saved Accommodation does not exist", 400, req, res);
    }
    
    return SuccessHandler({message: "Fetched Saved Accomodation", sAccomodations}, 200, res);
  }

  else{
    return ErrorHandler("Unauthorized User", 400, req, res);
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
  getSavedAccomodations,
};
