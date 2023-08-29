const Accomodation = require("../models/Accomodation/accomodation");
const Advertisement = require("../models/Accomodation/advertisement");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");

const advertiseAccomodations = async (req, res) => {
  const currentUser = req.user._id;
  const accomodationId = req.params.id;
  // #swagger.tags = ['advertise']
  const { days, amount } = req.body;
  try {
    // check if accommodation exist or not
    const accomodations = await Accomodation.find({
      isActive: true,
      currentUser,
      _id: accomodationId,
    });

    if (!accomodations) {
      return ErrorHandler("Accommodation does not exist", 400, req, res);
    }

    // check if advertisement already exist or not
    const isAdvertisement = await Advertisement.findOne({
      accommodation: accomodationId,
      isActive: true,
      host: currentUser,
    });
    if (!isAdvertisement) {
      return ErrorHandler(
        "Your Accommodation already advertised",
        400,
        req,
        res
      );
    }
    // adding number of days to today's date
    let date = new Date();
    let adExpiryDate = date.setDate(date.getDate() + days);
    const advertise = await Advertisement.create({
      host: currentUser,
      accommodation: accomodationId,
      days: days,
      //   expiryDate: expiryDate,
      amount: amount,
    });
    await Advertisement.findByIdAndUpdate(
      { accommodation: accomodationId },
      {
        expiryDate: adExpiryDate,
      }
    );

    return SuccessHandler(
      {
        success: true,
        message: "Advertisement created successfully",
        advertisement: advertise,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  advertiseAccomodations,
};
