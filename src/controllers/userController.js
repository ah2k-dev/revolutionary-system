const User = require("../models/User/user");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const Accomodation = require("../models/Accomodation/accomodation");
const Coupon = require("../models/Coupon/coupon");
const Meal = require("../models/Meal/meal");

// get Current user
const getUserProfile = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    return SuccessHandler({ message: "Profile Updated", user }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// if not req.files.avatar: previousFileName
// if  req.files.avatar: avatar

//update Personal Info
const updatePersonalInfo = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const { firstName, lastName } = req.body;
    // Get the previous avatar filename
    const checkUser = await User.findById(req.user._id);
    let previousAvatarFileName = checkUser.avatar;
    let previousCoverImgFileName = checkUser.coverImg;

    // let avatarFileName = null;
    // let coverImgFileName = null;
    console.log(req.files);
    if (req.files) {
      const { avatar, coverImg } = req.files;
      if (avatar) {
        // It should be image
        // if (!avatar.mimetype.startsWith("image")) {
        //   return ErrorHandler("Please upload an image file", 400, req, res);
        // }
        previousAvatarFileName = `${Date.now()}${avatar.name}`;
        console.log(previousAvatarFileName);
        avatar.mv(
          path.join(__dirname, `../../uploads/${previousAvatarFileName}`),
          (err) => {
            if (err) {
              return ErrorHandler(err.message, 400, req, res);
            }
          }
        );
      }
      if (coverImg) {
        // It should be image
        // if (!coverImg.mimetype.startsWith("image")) {
        //   return ErrorHandler("Please upload an image file", 400, req, res);
        // }

        previousCoverImgFileName = `${Date.now()}${coverImg.name}`;
        // Cover Img
        coverImg.mv(
          path.join(__dirname, `../../uploads/${previousCoverImgFileName}`),
          (err) => {
            if (err) {
              return ErrorHandler(err.message, 400, req, res);
            }
          }
        );
      }

      // Delete the previous avatar file (if it exists)
      // if (previousAvatarFileName !== null) {
      //   const previousAvatarPath = path.join(
      //     __dirname,
      //     `../../uploads/${previousAvatarFileName}`
      //     );
      //     console.log(previousAvatarPath);

      //     fs.unlink(previousAvatarPath, (err) => {
      //       if (err) {
      //         console.error(err);
      //         return;
      //       }
      //       console.log('File deleted successfully');
      //     });
      //   const filedDelted =  fs.unlink(()=> previousAvatarPath);
      //   console.log("filedDelted: ", filedDelted);
      // }

      // avatarFileName = `${Date.now()}${avatar.name}`;

      // avatar.mv(
      //   path.join(__dirname, `../../uploads/${avatarFileName}`),
      //   (err) => {
      //     if (err) {
      //       return ErrorHandler(err.message, 400, req, res);
      //     }
      //   }
      // );
    }

    //     // check avatarFileName should not saved null in DB
    //     let updateAvatarFileName = ''
    //  if (avatarFileName !==null) {

    //  }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        avatar: previousAvatarFileName,
        coverImg: previousCoverImgFileName,
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
      { message: "Updated Personal Info successfully", user },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//update user
const updateUser = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const {
      websiteLink,
      userDesc,
      country,
      // timeZone,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
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

// Saved or Unsaved Accomodation
const savedOrUnsavedAccomodation = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const currentUser = req.user._id;
    const accomodation = await Accomodation.findById(req.params.id);
    const user = await User.findById(currentUser);
    console.log("user: ", user);
    console.log("accommodation: ", accomodation);

    if (!accomodation) {
      return ErrorHandler("Accommodation does not exist", 400, req, res);
    }

    // if saved => remove id from user model and mark as unsaved
    if (user.savedAccomodation.includes(accomodation.id)) {
      const index = user.savedAccomodation.indexOf(accomodation.id);
      user.savedAccomodation.splice(index, 1);
      await user.save();
      return SuccessHandler(
        { message: "UnSaved Accomodation Successfully" },
        200,
        res
      );
    } else {
      user.savedAccomodation.push(accomodation.id);
      await user.save();
      return SuccessHandler({ message: "Saved Accomodation" }, 200, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// get Saved Accomodations
const getSavedAccomodations = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const currentUser = req.user._id;
    const user = await User.findById(currentUser).populate("savedAccomodation");

    let sAccomodations = user.savedAccomodation;

    // const accomodation = await Accomodation.findById(req.params.id)
    // console.log("user: ", user);
    // console.log("accommodation: ", accomodation);

    if (!sAccomodations) {
      return ErrorHandler("Saved Accommodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      { message: "Fetched Saved Accomodation", sAccomodations },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getCooks = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    // filter cook by name
    const cookShopFilter = req.body.shopName
      ? {
          shopName: {
            $regex: req.body.shopName,
            $options: "i",
          },
        }
      : {};

    // Location filter
    const locationFilter =
      req.body.coordinates && req.body.coordinates.length > 0
        ? {
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: req.body.coordinates,
                },
                $maxDistance: 10 * 1000,
              },
            },
          }
        : {};

    const getCook = await User.find({
      isActive: true,
      role: "cook",
      ...cookShopFilter,
      ...locationFilter,
    });
    const cookCount = getCook.length;

    if (!getCook) {
      return ErrorHandler("No Cook exist", 400, req, res);
    }

    return SuccessHandler(
      { message: "Fetched Cooks", cookCount, getCook },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// get all coupons for cook
//Get Coupons
const getCouponsForCook = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const currentUser = req.user._id;
    const coupons = await Coupon.find({
      createdBy: currentUser,
    });

    if (!coupons) {
      return ErrorHandler("Coupons not found", 404, req, res);
    }

    return SuccessHandler(
      { message: "Coupon Fetched successfully", coupons },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// Saved or Unsaved Meal
// const savedOrUnsavedMeal = async (req, res) => {
//   // #swagger.tags = ['user']
//   try {
//     const currentUser = req.user._id;
//     const meal = await Meal.findById(req.params.id);
//     const user = await User.findById(currentUser);
//     console.log(meal);

//     if (!meal) {
//       return ErrorHandler("Meal does not exist", 400, req, res);
//     }
//     if (user.savedMeal) {
      
//       if (user.savedMeal.includes(meal.id)) {
//         const index = user.savedMeal.indexOf(meal.id);
//         user.savedMeal.splice(index, 1);
//         await user.save();
//         return SuccessHandler(
//           { message: "UnSaved Meal with Successfully" },
//           200,
//           res
//           );
//         }
//     } else {
//       // user.savedMeal.push(meal.id);
//       // await user.save();
//       await User.updateOne({ _id: currentUser }, { $push: { savedMeal: meal.id } });

//       return SuccessHandler({ message: "Saved Meal" }, 200, res);
//     }
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

const savedOrUnsavedMeal = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const currentUser = req.user._id;
    const meal = await Meal.findById(req.params.id);
    const user = await User.findById(currentUser);
    console.log(meal);

    if (!meal) {
      return ErrorHandler("Meal does not exist", 400, req, res);
    }
    
    // Ensure user.savedMeal is defined as an array
    if (!user.savedMeal) {
      user.savedMeal = [];
    }

    if (user.savedMeal.includes(meal.id)) {
      const index = user.savedMeal.indexOf(meal.id);
      user.savedMeal.splice(index, 1);
      await user.save();
      console.log("UnSaved Meal");
      return SuccessHandler(
        { message: "UnSaved Meal Successfully" },
        200,
        res
      );
    } else {
      // Debug: Print user.savedMeal before the push operation
      console.log("Before Push:", user.savedMeal);

      // Use the $push operator to add the meal ID
      await User.updateOne({ _id: currentUser }, { $push: { savedMeal: meal.id } });

      // Debug: Print user.savedMeal after the push operation
      console.log("After Push:", user.savedMeal);

      console.log("Saved Meal");
      return SuccessHandler({ message: "Saved Meal" }, 200, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};



// get Saved Meals
const getSavedMeals = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const currentUser = req.user._id;
    const user = await User.findById(currentUser).populate("savedMeal");

    let savedMeals = user.savedAccomodation;
    if (!savedMeals) {
      return ErrorHandler("Saved Meal does not exist", 404, req, res);
    }

    return SuccessHandler(
      { message: "Fetched Saved Meal", savedMeals },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  updateUser,
  getUserProfile,
  savedOrUnsavedAccomodation,
  getSavedAccomodations,
  updatePersonalInfo,
  getCooks,
  getCouponsForCook,
  savedOrUnsavedMeal,
  getSavedMeals,
};
