const Accommodation = require("../models/Accommodation/accommodation");
const Review = require("../models/Reviews/review");
const Booking = require("../models/Accommodation/booking");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
//Create Accomodations
const createAccomodations = async (req, res) => {
  // #swagger.tags = ['accommodation']
  try {
    const {
      title,
      desc,
      latitude,
      longitude,
      roomCapacity,
      services,
      roomPrice,
      dinnerPrice,
      dinnerCapacity,
    } = req.body;
    const currentUser = req.user._id;

    const isAccommodationsExist = await Accommodation.findOne({
      host: currentUser,
    });

    if (isAccommodationsExist) {
      return ErrorHandler("Accommodation already exist", 400, req, res);
    }

    if (!req.files || !req.files.images || req.files.images.length === 0) {
      return ErrorHandler("Please upload at least one image", 500, req, res);
    }

    let imagesFileName = [];

    const { images } = req.files;

    // Ensure `images` is an array, even if there's only one image uploaded
    const imageArray = Array.isArray(images) ? images : [images];

    for (const img of imageArray) {
      if (!img.mimetype.startsWith("image")) {
        return ErrorHandler("Please upload an image", 500, req, res);
      }
      let imgFile = `${Date.now()}-${img.name}`;
      imagesFileName.push(imgFile);
      img.mv(path.join(__dirname, `../../uploads/${imgFile}`), (err) => {
        if (err) {
          return ErrorHandler(err.message, 400, req, res);
        }
      });
    }

    const newAccomodation = await Accommodation.create({
      host: currentUser,
      title,
      desc,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      roomCapacity,
      services,
      images: imagesFileName,
      roomPrice,
      dinnerPrice,
      dinnerCapacity,
      // availableRoomCapacity: roomCapacity,
      // availableDinnerCapacity: dinnerCapacity,
    });

    await newAccomodation.save();

    return SuccessHandler(
      { message: "Added successfully", newAccomodation },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getAccomodations = async (req, res) => {
  // #swagger.tags = ['accommodation']
  try {
    // // ✅ Room filter
    // const roomFilter = req.body.rooms
    //   ? {
    //       rooms: req.body.rooms,
    //     }
    //   : {};

    // ✅ DinnerSeat filter
    // const dinnerSeatFilter = req.body.dinnerSeats
    //   ? {
    //       availableDinnerCapacity: { $lte: req.body.dinnerSeats },
    //     }
    //   : {};

    //✅ Price Filter
    // const priceFilter = req.body.priceRange
    //   ? {
    //       roomPrice: {
    //         $gte: Number(req.body.priceRange[0]),
    //         $lte: Number(req.body.priceRange[1]),
    //       },
    //     }
    //   : {};
    // ✅Location filter
    const locationFilter =
      req.body.coordinates && req.body.coordinates.length == 2
        ? {
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: req.body.coordinates,
                },
                $maxDistance: 30 * 1000,
              },
            },
          }
        : {};

    console.log("Get Accommodation Block");
    console.log("after Accommodation Block");
    let unAvailableAccommodations = [];
    if (req.body.date) {
      // const bookings = await Booking.find({
      //   startDate: {
      //     $in: req.body.date[0],
      //   },
      //   endDate: {
      //     $lte: req.body.date[1],
      //   },
      // });
      const bookings = await Booking.find({
        startDate: { $gte: req.body.date[0] },
        endDate: { $lte: req.body.date[1] },
      });

      console.log(req.body.date[0]);
      console.log(req.body.date[1]);
      console.log(bookings);
      console.log(bookings.length);

      // .populate("accommodation").distinct(_id);

      // unAvailableAccommodations = bookings.map((val, ind) => {
      //   return val.accommodation;
      // });
      // console.log(unAvailableAccommodations);

      // .filter((val) => val.roomsBooked > req.body.rooms);
    }

    const availabilityFilter =
      unAvailableAccommodations.length > 0
        ? {
            _id: {
              $nin: unAvailableAccommodations,
            },
          }
        : {};

    const accommodations = await Accommodation.find({
      isActive: true,
      // ...roomFilter,
      ...locationFilter,
      // ...priceFilter,
      // ...dinnerSeatFilter,
      ...availabilityFilter,
    }).sort({ status: 1 });

    if (!accommodations) {
      return ErrorHandler("Accommodation doesn't exist", 400, req, res);
    }
    const accommodationCount = accommodations.length;
    return SuccessHandler(
      {
        message: "Accommodations fetched successfully",
        accommodationCount,
        accommodations,
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const deleteAccomodations = async (req, res) => {
  // #swagger.tags = ['accommodation']
  const accommodationId = req.params.id;
  try {
    const currentUser = req.user._id;
    const accommodation = await Accommodation.findByIdAndUpdate(
      accommodationId,
      {
        host: currentUser,
        isActive: false,
      }
    );
    await Meal.updateMany({ host: currentUser }, { $set: { isActive: false } });

    if (!accommodation) {
      return ErrorHandler("Accommodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      { message: "Accommodation Deleted successfully" },

      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};
const updateAccommodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  try {
    const {
      title,
      desc,
      latitude,
      longitude,
      roomCapacity,
      services,
      roomPrice,
      dinnerPrice,
      dinnerCapacity,
    } = req.body;
    const currentUser = req.user._id;

    // just for images
    const accommodation = await Accommodation.findOne({
      _id: req.params.id,
      host: currentUser,
    });

    console.log("Debugging: ", accommodation);
    if (!accommodation) {
      return ErrorHandler(
        "Accommodation not found or unauthorized",
        404,
        req,
        res
      );
    }

    let imagesFileName = [];
    accommodation.images.forEach((img) => imagesFileName.push(img));
    console.log("outerImages Array: ", imagesFileName);
    if (req.files && req.files.images) {
      console.log("Upload block");
      imagesFileName = [];
      const { images } = req.files;

      // `images` is an array, if there's only one image uploaded
      const imageArray = Array.isArray(images) ? images : [images];
      for (const img of imageArray) {
        if (!img.mimetype.startsWith("image")) {
          return ErrorHandler("Please upload an image", 500, req, res);
        }
        let imgFile = `${Date.now()}-${img.name}`;
        imagesFileName.push(imgFile);
        img.mv(path.join(__dirname, `../../uploads/${imgFile}`), (err) => {
          if (err) {
            return ErrorHandler(err.message, 400, req, res);
          }
        });
      }
    }
    const updatedAccomodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      {
        title,
        desc,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },

        roomCapacity,
        services,
        roomPrice,
        dinnerPrice,
        dinnerCapacity,
        createdBy: currentUser,
        images: imagesFileName,
        // availableRoomCapacity: roomCapacity,
        // availableDinnerCapacity: dinnerCapacity,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAccomodation) {
      return ErrorHandler("Accommodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      { success: true, message: "Updated successfully", updatedAccomodation },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  createAccomodations,
  getAccomodations,
  updateAccommodations,
  deleteAccomodations,
};
