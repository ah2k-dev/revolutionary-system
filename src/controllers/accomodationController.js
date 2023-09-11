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
    // ✅ DinnerSeat filter
    // const dinnerSeatFilter = req.body.dinnerSeats
    //   ? {
    //       availableDinnerCapacity: { $lte: req.body.dinnerSeats },
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

    // if (req.body.date) {

    const startDate = new Date(req.body.date[0]);
    // console.log(startDate);
    const endDate = new Date(req.body.date[1]);

    const accommodationWithBookings = await Booking.aggregate([
      {
        $match: {
          isActive: true,
          startDate: {
            $eq: startDate,
          },
          endDate: {
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$accommodation",
          totalRoomBooked: { $sum: "$roomsBooked" },
        },
      },
      {
        $lookup: {
          from: "accommodations",
          localField: "_id",
          foreignField: "_id",
          as: "accommodationData",
        },
      },
      {
        $addFields: {
          accommodationData: { $arrayElemAt: ["$accommodationData", 0] },
        },
      },

      {
        $addFields: {
          availableRooms: {
            $subtract: ["$accommodationData.roomCapacity", "$totalRoomBooked"],
          },
        },
      },

      {
        $match: { availableRooms: { $gte: req.body.rooms } },
      },
    ]);

    const accommodationsWithoutBookings = await Accommodation.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "accommodation",
          as: "bookings",
        },
      },
      {
        $match: {
          bookings: { $size: 0 },
          isActive: true,
        },
      },
      {
        $project: {
          _id: 0,
          accommodation: "$$ROOT",
          availableRooms: "$roomCapacity",
        },
      },
      {
        $match: { availableRooms: { $gte: req.body.rooms } },
      },
    ]);

    // const bookings = await Booking.aggregate([
    //   {
    //     $match: {
    //       startDate: {
    //         $eq: {
    //           $dateToString: {
    //             format: "%Y-%m-%d",
    //             date: "$startDate",
    //             timezone: "UTC",
    //           },
    //         },
    //       },
    //       // endDate: {
    //       //   $lte: {
    //       //     $dateToString: {
    //       //       format: "%Y-%m-%d",
    //       //       date: "$endDate",
    //       //       timezone: "UTC",
    //       //     },
    //       //   },
    //       // },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$accommodation",
    //       totalRoomBooked: { $sum: "$roomsBooked" },
    //     },
    //   },
    // ]);

    // console.log(bookings);

    // const bookings = await Booking.aggregate([
    //   {
    //     $match: {
    //       startDate: {
    //         $eq: {
    //           $dateToString: {
    //             format: "%Y-%m-%d",
    //             date: new Date(req.body.date[0]),
    //           },
    //         },
    //       },
    //       endDate: {
    //         $lte: {
    //           $dateToString: {
    //             format: "%Y-%m-%d",
    //             date: new Date(req.body.date[1]),
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$accommodation",
    //       totalRoomBooked: { $sum: "$roomsBooked" },
    //     },
    //   },
    // ]);

    // console.log(new Date(req.body.date[0]));
    // console.log(new Date(req.body.date[1]));
    // console.log(startDate);
    // console.log(endDate);

    // .populate("accommodation").distinct(_id);

    // unAvailableAccommodations = bookings.map((val, ind) => {
    //   return val.accommodation;
    // });
    // console.log(unAvailableAccommodations);

    // .filter((val) => val.roomsBooked > req.body.rooms);

    // const availabilityFilter =
    //   unAvailableAccommodations.length > 0
    //     ? {
    //         _id: {
    //           $nin: unAvailableAccommodations,
    //         },
    //       }
    //     : {};

    // }
    // const accommodationIdsWithBookings = bookings.map((booking) => booking._id);
    // console.log("IDS: ", accommodationIdsWithBookings);
    // const accommodationsWithoutBookings = await Accommodation.find({
    //   isActive: true,
    //   _id: { $nin: accommodationIdsWithBookings },
    //   // roomCapacity: { $gte: req.body.rooms },
    // });
    // console.log("WITHOU BOOKINGS: ", accommodationsWithoutBookings);

    // Combine the results if needed
    // const allAccommodations = [...bookings, ...accommodationsWithoutBookings];
    // const count = allAccommodations.length;
    // console.log(allAccommodations);
    const accommodations = await Accommodation.find({
      isActive: true,
      ...locationFilter,
      // ...availabilityFilter,
    }).sort({ status: 1 });

    if (!accommodations) {
      return ErrorHandler("Accommodation doesn't exist", 400, req, res);
    }
    return SuccessHandler(
      {
        message: "Accommodations fetched successfully",
        accommodationWithBookings,
        accommodationsWithoutBookings,
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
    // await Meal.updateMany({ host: currentUser }, { $set: { isActive: false } });

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
