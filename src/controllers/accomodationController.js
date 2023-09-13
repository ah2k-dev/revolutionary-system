const Accommodation = require("../models/Accommodation/accommodation");
const Review = require("../models/Reviews/review");
const Booking = require("../models/Accommodation/booking");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const moment = require("moment");
const mongoose = require("mongoose");
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
                $maxDistance: 10 * 1000,
              },
            },
          }
        : {};

    // ✅Location filter
    // const locationFilter =
    //   req.body.coordinates && req.body.coordinates.length == 2
    //     ? {
    //         location: {
    //           $geoNear: {
    //             near: {
    //               type: "Point",
    //               coordinates: req.body.coordinates,
    //             },
    //             distanceField: "dist.calculated",
    //             maxDistance: 100 * 1000,
    //             includeLocs: "dist.location",
    //             spherical: true,
    //           },
    //         },
    //       }
    //     : {};

    // if (req.body.date) {

    // const startDate = new Date(req.body.date[0]);
    // // console.log(startDate);
    // const endDate = new Date(req.body.date[1]);
    // const sDate = moment(new Date(req.body.date[0]));
    // const eDate = moment(new Date(req.body.date[1]));
    // const startDate = moment(req.body.date[0]).startOf("day").format();
    // const endDate = moment(req.body.date[1]).startOf("day").format();

    const startDate = moment(req.body.date[0]).startOf("day").format();
    const endDate = moment(req.body.date[1]).endOf("day").format();
    console.log(startDate);
    console.log(endDate);
    const accommodationIds = await Accommodation.find({
      isActive: true,
      ...locationFilter,
    }).distinct("_id");
    console.log("DISTINCT", accommodationIds);
    // let accommodationIdEx = accommodationIds.map((val) =>
    //   mongoose.Types.ObjectId(val)
    // );
    // console.log(accommodationIdEx);

    const accommodationWithBookings = await Booking.aggregate([
      {
        $match: {
          accommodation: { $in: accommodationIds },
          status: "active",
          startDate: {
            $gte: new Date(startDate),
          },
          endDate: {
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$accommodation",
          totalDinnerReserved: { $sum: "$dinnerSeats" },
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
          availableDinnerSeats: {
            $subtract: [
              "$accommodationData.dinnerCapacity",
              "$totalDinnerReserved",
            ],
          },
          availableRooms: {
            $subtract: ["$accommodationData.roomCapacity", "$totalRoomBooked"],
          },
        },
      },

      {
        $match: { availableDinnerSeats: { $gte: req.body.dinnerSeats } },
      },
    ]);

    console.log("Bookings", accommodationWithBookings);
    const accommodationsWithoutBookings = await Accommodation.aggregate([
      // {
      //   $group: {
      //     _id: "$_id",
      //     totalDinnerReserved: { $sum: "$dinnerSeats" },
      //     totalRoomBooked: { $sum: "$roomsBooked" },
      //   },
      // },
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
          _id: { $in: accommodationIds },
          // isActive: true,
        },
      },

      {
        $project: {
          _id: 0,
          accommodationData: "$$ROOT",
          availableDinnerSeats: "$dinnerCapacity",
          availableRooms: "$roomCapacity",
        },
      },
      {
        $addFields: {
          totalDinnerReserved: 0,
          totalRoomBooked: 0,
        },
      },
      {
        $match: { availableDinnerSeats: { $gte: req.body.dinnerSeats } },
      },
    ]);

    // const [{ accommodationData }] = accommodationWithBookings;
    // const [{ accommodationData }] = accommodationsWithoutBookings;
    const availableAccommodations = [
      ...accommodationWithBookings,
      ...accommodationsWithoutBookings,
    ];

    // console.log(accommodationWithBookings);
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

    if (!accommodationIds) {
      return ErrorHandler("Accommodation doesn't exist", 400, req, res);
    }
    return SuccessHandler(
      {
        message: "Accommodations fetched successfully",
        availableAccommodations,
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

const getReviews = async (req, res) => {
  // #swagger.tags = ['accommodation']
  const { accommodationId } = req.params;
  try {
    const reviews = await Review.find({
      accommodation: accommodationId,
    })
      .select({ comment: 1, rating: 1, user: 1, createdAt: 1, _id: 0 })
      .populate({
        path: "user",
        select: "username firstName email avatar",
      });
    // .select("+comment +rating +user +createdAt");
    if (!reviews) {
      return ErrorHandler("No Such Review exist.", 400, req, res);
    }
    return SuccessHandler(
      { message: "Reviews Fetched Successfully", reviews },
      200,
      res
    );
  } catch (error) {
    ErrorHandler(error.message, 500, req, res);
  }
};

module.exports = {
  createAccomodations,
  getAccomodations,
  updateAccommodations,
  deleteAccomodations,
  getReviews,
};
