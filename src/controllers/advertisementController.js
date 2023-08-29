const Accomodation = require("../models/Accomodation/accomodation");
const Advertisement = require("../models/Accomodation/advertisement");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");

const advertiseAccomodations = async (req, res) => {
  const currentUser = req.user._id;
  const accomodationId = req.params.id;
  const accommodationTag = "sponsored";
  // #swagger.tags = ['ads']
  const { days, amount } = req.body;
  try {
    // check if accommodation exist or not
    const accomodations = await Accomodation.findOne({
      _id: accomodationId,
      createdBy: currentUser,
    });

    if (!accomodations) {
      return ErrorHandler(
        "Accommodation does not exist or you are not the creator",
        400,
        req,
        res
      );
    }

    // check if advertisement already exist or not
    const isAdvertisement = await Advertisement.findOne({
      accommodation: accomodationId,
      isActive: true,
      host: currentUser,
    });
    if (isAdvertisement) {
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
      expiryDate: new Date(adExpiryDate),
      amount: amount,
    });

    await Accomodation.findByIdAndUpdate(accomodationId, {
      tag: accommodationTag,
    });

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

const getAdvertisedAccomodations = async (req, res) => {
  const currentDate = new Date();
  // #swagger.tags = ['ads']
  try {
    let ads = await Advertisement.updateMany(
      {
        expiryDate: { $lte: currentDate },
        isActive: true,
      },
      { $set: { isActive: false } }
    );
    console.log("ads: ", ads);

    const advertisements = await Advertisement.find({
      isActive: true,
      //   expiryDate: { $gte: currentDate },
    }).sort({
      createdAt: -1,
    });
    return SuccessHandler(
      {
        success: true,
        message: "Advertisements fetched successfully",
        advertisements,
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
  getAdvertisedAccomodations,
};
