const User = require("../models/User/user");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const Accomodation = require("../models/Accomodation/accomodation");

// get Current user
const getUserProfile = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    return SuccessHandler({ message: "Here you go", user }, 200, res);
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
    if (req.files) {
      const { avatar, coverImg } = req.files;
      if (avatar) {
        // It should be image
        if (!avatar.mimetype.startsWith("image")) {
          return ErrorHandler("Please upload an image file", 400, req, res);
        }
        previousAvatarFileName = `${Date.now()}${avatar.name}`;
        avatar.mv(
          path.join(
            __dirname,
            `../../uploads/avatar/${previousAvatarFileName}`
          ),
          (err) => {
            if (err) {
              return ErrorHandler(err.message, 400, req, res);
            }
          }
        );
      }
      if (coverImg) {
        // It should be image
        if (!coverImg.mimetype.startsWith("image")) {
          return ErrorHandler("Please upload an image file", 400, req, res);
        }

        previousCoverImgFileName = `${Date.now()}${coverImg.name}`;
        // Cover Img
        coverImg.mv(
          path.join(
            __dirname,
            `../../uploads/avatar/${previousCoverImgFileName}`
          ),
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
      //     `../../uploads/avatar/${previousAvatarFileName}`
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
      //   path.join(__dirname, `../../uploads/avatar/${avatarFileName}`),
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
    if (req.user.role === "user") {
      const accomodation = await Accomodation.findById(req.params.id);
      const user = await User.findById(currentUser);
      console.log("user: ", user);
      console.log("accommodation: ", accomodation);

      if (!accomodation) {
        return ErrorHandler("Accommodation does not exist", 400, req, res);
      }

      // if saved => remove id from user model and mark as unsaved
      if (user.savedAccomodation.includes(accomodation.id)) {
        const index = user.savedAccomodation.indexOf(currentUser);
        user.savedAccomodation.splice(index, 1);
        await user.save();
        return SuccessHandler("UnSaved Accomodation Successfully", 200, res);
      } else {
        user.savedAccomodation.push(accomodation.id);
        await user.save();
        return SuccessHandler("Saved Accomodation", 200, res);
      }
    }

    // if not user.role ==='user'
    else {
      return ErrorHandler("Unauthorized User", 500, req, res);
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
    if (req.user.role === "user") {
      const user = await User.findById(currentUser).populate(
        "savedAccomodation"
      );

      let sAccomodations = user.savedAccomodation;

      // const accomodation = await Accomodation.findById(req.params.id)
      // console.log("user: ", user);
      // console.log("accommodation: ", accomodation);

      if (!sAccomodations) {
        return ErrorHandler(
          "Saved Accommodation does not exist",
          400,
          req,
          res
        );
      }

      return SuccessHandler(
        { message: "Fetched Saved Accomodation", sAccomodations },
        200,
        res
      );
    } else {
      return ErrorHandler("Unauthorized User", 400, req, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getCooks = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    // filter cook by name
    const cookNameFilter = req.body.search
      ? {
          $or: [
            {
              firstName: {
                $regex: req.body.search,
                $options: "i",
              },
            },
            {
              lastName: {
                $regex: req.body.search,
                $options: "i",
              },
            },
          ],
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
      ...cookNameFilter,
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

module.exports = {
  updateUser,
  getUserProfile,
  savedOrUnsavedAccomodation,
  getSavedAccomodations,
  updatePersonalInfo,
  getCooks,
};
