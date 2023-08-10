const User = require("../models/User/user");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");

//update user
const updateUser = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      userDesc,
      country,
      timeZone,
      websiteLink,
    } = req.body;

    const { avatar } = req.files;
    if (!avatar) {
        return ErrorHandler("Please upload an image", req, 400, res);
    }
    if (!avatar.mimetype.startsWith("image")) {
        return ErrorHandler("Please upload an image file", req, 400, res);
    }

    const fileName = `${req.user._id}-${Date.now()}${path.parse(avatar.name).ext}`;

    avatar.mv(path.join(__dirname, `../../uploads/${fileName}`), (err) => {
        if (err) {
            return ErrorHandler(err.message, req, 500, res);
        }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        phoneNumber,
        userDesc,
        country,
        timeZone,
        websiteLink,
        avatar: `/uploads/${fileName}`,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return ErrorHandler("User does not exist", req, 400, res);
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

module.exports = {
  updateUser,
};
