const User = require("../models/User/user");
const sendMail = require("../utils/sendMail");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
//register
const register = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const { firstName, lastName, email, password, country, role } = req.body;
    console.log(req.body);
    if (firstName.length < 1 || lastName.length < 1) {
      return ErrorHandler(
        "Please, ensure names have at least 2 characters.",
        400,
        req,
        res
      );
    }

    if (
      !password.match(
        /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/
      )
    ) {
      return ErrorHandler(
        "Password must contain atleast one uppercase letter, one special character and one number",
        400,
        req,
        res
      );
    }

    let avatarFileName = null;
    let coverImgfileName = null;

    if (req.files) {
      const { avatar, coverImg } = req.files;

      if (avatar) {
        // It should be image
        if (!avatar.mimetype.startsWith("image")) {
          return ErrorHandler("Please upload an image file", 400, req, res);
        }
        avatarFileName = `${Date.now()}${avatar.name}`;
        avatar.mv(
          path.join(__dirname, `../../uploads/${avatarFileName}`),
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

        coverImgfileName = `${Date.now()}${coverImg.name}`;
        // Cover Img
        coverImg.mv(
          path.join(__dirname, `../../uploads/${coverImgfileName}`),
          (err) => {
            if (err) {
              return ErrorHandler(err.message, 400, req, res);
            }
          }
        );
      }
    }

    let uniqueUserName = `firstName${uuid.v1()}`;
    const user = await User.findOne({ email });
    if (user) {
      return ErrorHandler("User already exists", 400, req, res);
    }

    let newUserFields = {
      firstName,
      lastName,
      email,
      password,
      country,
      username: uniqueUserName,
      avatar: avatarFileName || null,
      coverImg: coverImgfileName || null,
      role,
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    };

    // for cook
    if (role === "cook") {
      console.log("Cook block");
      let bannerImg = null;
      const { latitude, longitude, shopName, shopDesc } = req.body;
      // if (!(latitude || longitude || shopName || shopDesc || shopBanner)) {
      if (req.files) {
        const { shopBanner } = req.files;

        if (shopBanner) {
          // It should be image
          if (!shopBanner.mimetype.startsWith("image")) {
            return ErrorHandler(
              "Please upload an Banner Image for shop",
              400,
              req,
              res
            );
          }
          bannerImg = `${Date.now()}${shopBanner.name}`;
          shopBanner.mv(
            path.join(__dirname, `../../uploads/${bannerImg}`),
            (err) => {
              if (err) {
                return ErrorHandler(err.message, 400, req, res);
              }
            }
          );
          // }
        }

        // return ErrorHandler(
        //   "Latitude, Longitude or Shop name is missing",
        //   400,
        //   req,
        //   res
        // );
      }
      // let parselatitude = Number(latitude);
      // let parselongitude = Number(longitude);
      newUserFields = {
        ...newUserFields,
        shopName,
        shopDesc,
        shopBanner: bannerImg,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      };
    }
    console.log(newUserFields);
    // saved user
    const newUser = await User.create(newUserFields);
    newUser.save();
    return SuccessHandler(`${role} created successfully`, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//request email verification token
const requestEmailToken = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000);
    const emailVerificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpires = emailVerificationTokenExpires;
    await user.save();
    const message = `Your email verification token is ${emailVerificationToken} and it expires in 10 minutes`;
    const subject = `Email verification token`;
    await sendMail(email, subject, message);
    return SuccessHandler(
      `Email verification token sent to ${email}`,
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//verify email token
const verifyEmail = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    const { email, emailVerificationToken } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return ErrorHandler(
        { success: false, message: "User does not exist" },
        400,
        req,
        res
      );
    }
    if (
      user.emailVerificationToken !== emailVerificationToken ||
      user.emailVerificationTokenExpires < Date.now()
    ) {
      return ErrorHandler("Invalid token", 400, req, res);
    }
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;
    jwtToken = user.getJWTToken();
    await user.save();
    return SuccessHandler(
      { success: true, message: "Email verified successfully" },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//login
const login = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return ErrorHandler("Please provide email and password", 400, req, res);
    }
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      return ErrorHandler("Please, provide correct credentials", 400, req, res);
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return ErrorHandler("Invalid credentials", 400, req, res);
    }
    if (!user.emailVerified) {
      return ErrorHandler("Email not verified", 400, req, res);
    }
    jwtToken = user.getJWTToken();

    return SuccessHandler(
      {
        success: true,
        message: "Logged in successfully",
        jwtToken,
        user,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//logout
const logout = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    req.user = null;
    return SuccessHandler("Logged out successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//forgot password
const forgotPassword = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    const passwordResetToken = Math.floor(100000 + Math.random() * 900000);
    const passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetToken = passwordResetToken;
    user.passwordResetTokenExpires = passwordResetTokenExpires;
    await user.save();
    const message = `Your password reset token is ${passwordResetToken} and it expires in 10 minutes`;
    const subject = `Password reset token`;
    await sendMail(email, subject, message);
    return SuccessHandler(`Password reset token sent to ${email}`, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//reset password
const resetPassword = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    const { email, passwordResetToken, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return ErrorHandler("User does not exist", 400, req, res);
    }
    if (
      user.passwordResetToken !== passwordResetToken ||
      user.passwordResetTokenExpires < Date.now()
    ) {
      return ErrorHandler("Invalid token", 400, req, res);
    }
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();
    return SuccessHandler("Password reset successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//update password
const updatePassword = async (req, res) => {
  // #swagger.tags = ['auth']

  try {
    const { currentPassword, newPassword } = req.body;
    if (
      !newPassword.match(
        /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/
      )
    ) {
      return ErrorHandler(
        "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character",
        400,
        req,
        res
      );
    }
    const user = await User.findById(req.user.id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return ErrorHandler("Invalid credentials", 400, req, res);
    }
    const samePasswords = await user.comparePassword(newPassword);
    if (samePasswords) {
      return ErrorHandler(
        "New password cannot be same as old password",
        400,
        req,
        res
      );
    }
    user.password = newPassword;
    await user.save();
    return SuccessHandler("Password updated successfully", 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

//update Personal Info
const updatePersonalInfo = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const { firstName, lastName } = req.body;
    // Get the previous avatar filename
    const checkUser = await User.findById(req.user._id);
    console.log(checkUser);
    const previousAvatarFileName = checkUser.avatar;
    console.log(previousAvatarFileName);

    let avatarFileName = null;
    if (req.files) {
      const { avatar } = req.files;
      // Delete the previous avatar file (if it exists)
      if (previousAvatarFileName !== null) {
        const previousAvatarPath = path.join(
          __dirname,
          `../../uploads/${previousAvatarFileName}`
        );
        console.log(previousAvatarPath);

        fs.unlink(previousAvatarPath, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log("File deleted successfully");
        });
        const filedDelted = fs.unlink(() => previousAvatarPath);
        console.log("filedDelted: ", filedDelted);
      }

      avatarFileName = `${Date.now()}${avatar.name}`;

      avatar.mv(
        path.join(__dirname, `../../uploads/${avatarFileName}`),
        (err) => {
          if (err) {
            return ErrorHandler(err.message, 400, req, res);
          }
        }
      );
    } else {
      avatarFileName = previousAvatarFileName;
    }

    //     // check avatarFileName should not saved null in DB
    let updateAvatarFileName = "";
    if (avatarFileName !== null) {
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        avatar: avatarFileName,
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

const googleAuth = async (req, res) => {
  // #swagger.tags = ['auth']
  try {
    const { email, firstName, lastName, profilePic, phoneNumber, role } =
      req.body;

    console.log(req.body);

    const exUser = await User.findOne({ email });
    if (exUser && exUser.provider === "google") {
      const token = await exUser.getJWTToken();
      return SuccessHandler({ token, user: exUser }, 200, res);
    } else if (exUser && exUser.provider !== "google") {
      return ErrorHandler(
        "User exists with different provider. Use the one you used before",
        400,
        req,
        res
      );
    } else {
      const user = await User.create({
        email,
        firstName,
        lastName,
        profilePic,
        phoneNumber,
        role,
        provider: "google",
        username: email.split("@")[0],
      });
      const token = await user.getJWTToken();
      return SuccessHandler({ token, user }, 200, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  register,
  requestEmailToken,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  updatePersonalInfo,
  googleAuth,
};
