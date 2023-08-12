const Host = require("../models/Host/host");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");

//Create Accomodations
const createAccomodations = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const {
      title,
      desc,
      availability,
      location,
      capacity
    } = req.body;
    const getUser = req.user._id
    const isAccomodationsExist = await Host.findOne({
      title,
      createdBy: getUser
    });
    
    if (isAccomodationsExist) {
      return ErrorHandler("Accomodation already exist", 400, req, res);
    }
    
    const newAccomodations = await Host.create({
      title,
      desc,
      availability,
      location,
      capacity,
      createdBy: getUser
    });

    newAccomodations.save();

    return SuccessHandler(
      { message: "Added successfully", newAccomodations },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  createAccomodations,
};
