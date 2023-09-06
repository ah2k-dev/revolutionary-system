const Accommodation = require("../models/Accommodation/accommodation");
const Review = require("../models/Reviews/review");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");
const Meal = require("../models/Meal/meal");
//Create Accomodations
const createAccomodations = async (req, res) => {
  // #swagger.tags = ['accommodation']
  try {
    const {
      title,
      desc,
      latitude,
      longitude,
      capacity,
      services,
      price,
      meals,
    } = req.body;
    console.log(meals);

    const currentUser = req.user._id;

    const isAccommodationsExist = await Accommodation.findOne({
      host: currentUser,
    });

    if (isAccommodationsExist) {
      return ErrorHandler("Accommodation already exist", 400, req, res);
    }
    let createdMeals = [];
    if (meals && Array.isArray(meals) && meals.length > 0) {
      createdMeals = await Meal.insertMany(
        meals.map((val) => {
          return {
            ...val,
            mealType: "host",
            host: currentUser,
          };
        })
      );
    }
    console.log(createdMeals);
    let imagesFileName = [];
    const { images } = req.files;
    // console.log(images);
    if (req.files?.images) {
      for (const img of images) {
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

    const newAccomodation = await Accommodation.create({
      title,
      desc,
      price: Number(price),
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      capacity: Number(capacity),
      services,
      host: currentUser,
      images: imagesFileName,
      meals: createdMeals.map((val) => val._id),
    });

    await newAccomodation.save();

    return SuccessHandler(
      { success: true, message: "Added successfully", newAccomodation },
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
    // Capacity filter
    const capacityFilter = req.body.capacity
      ? {
          capacity: req.body.capacity,
        }
      : {};
    // Location filter
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

    // let unAvailableAccommodations = [];
    // if (req.body.date && req.body.date > 0) {
    //   const bookings = await bookingAccomodation.find({
    //     startDate: {
    //       $in: req.body.date[0],
    //     },
    //     endDate: {
    //       $lte: req.body.date[1],
    //     },
    //   });

    //   unAvailableAccommodations = bookings.map((val, ind) => {
    //     return val.accomodationsId;
    //   });
    // }
    // const availabilityFilter =
    //   unAvailableAccommodations.length > 0
    //     ? {
    //         _id: {
    //           $nin: unAvailableAccommodations,
    //         },
    //       }
    //     : {};

    const accommodations = await Accommodation.find({
      isActive: true,
      ...capacityFilter,
      ...locationFilter,
      ...availabilityFilter,
    }).populate({
      path: "meals",
    });

    if (!accommodations) {
      return ErrorHandler("Accommodation doesn't exist", 400, req, res);
    }

    return SuccessHandler(
      { success: true, message: "Added successfully", accommodations },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// const updateAccomodations = async (req, res) => {
//   // #swagger.tags = ['accomodation']
//   try {
//     const { title, desc, latitude, longitude, capacity, services } = req.body;
//     const currentUser = req.user._id;

//     let imagesFileName = [];
//     const { images } = req.files;
//     if (images) {
//       for (const img of images) {
//         if (!img.mimetype.startsWith("image")) {
//           return ErrorHandler("Please upload an image", 500, req, res);
//         }
//         let imgFile = `${Date.now()}-${img.name}`;
//         imagesFileName.push(imgFile);
//         img.mv(path.join(__dirname, `../../uploads/${imgFile}`), (err) => {
//           if (err) {
//             return ErrorHandler(err.message, 400, req, res);
//           }
//         });
//       }
//     }

//     const updatedAccomodation = await Accomodation.findByIdAndUpdate(
//       req.params.id,
//       {
//         title,
//         desc,
//         location: {
//           type: "Point",
//           coordinates: [longitude, latitude],
//         },

//         capacity,
//         services,
//         createdBy: currentUser,
//         images: imagesFileName,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedAccomodation) {
//       return ErrorHandler("Accommodation does not exist", 400, req, res);
//     }

//     return SuccessHandler(
//       { success: true, message: "Updated successfully", updatedAccomodation },
//       200,
//       res
//     );
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

// const deleteAccomodations = async (req, res) => {
//   // #swagger.tags = ['accomodation']
//   // TODO: image array
//   try {
//     const deleteAccomodation = await Accomodation.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           isActive: false,
//         },
//       }
//     );

//     if (!deleteAccomodation) {
//       return ErrorHandler("Accommodation does not exist", 400, req, res);
//     }

//     return SuccessHandler(
//       { success: true, message: "Deleted successfully" },
//       200,
//       res
//     );
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

// const getAllAccomodations = async (req, res) => {
//   // #swagger.tags = ['accomodation']
//   try {
//     const capacityFilter = req.body.capacity
//       ? {
//           capacity: req.body.capacity,
//         }
//       : {};

//     // Location filter
//     const locationFilter =
//       req.body.coordinates && req.body.coordinates.length == 2
//         ? {
//             location: {
//               $near: {
//                 $geometry: {
//                   type: "Point",
//                   coordinates: req.body.coordinates,
//                 },
//                 $maxDistance: 10 * 1000,
//               },
//             },
//           }
//         : {};

//     let unAvailableAccommodations = [];

//     if (req.body.date && req.body.date > 0) {
//       const bookings = await bookingAccomodation.find({
//         startDate: {
//           $in: req.body.date[0],
//         },
//         endDate: {
//           $lte: req.body.date[1],
//         },
//       });

//       unAvailableAccommodations = bookings.map((val, ind) => {
//         return val.accomodationsId;
//       });
//     }

//     const availabilityFilter =
//       unAvailableAccommodations.length > 0
//         ? {
//             _id: {
//               $nin: unAvailableAccommodations,
//             },
//           }
//         : {};

//     const getAccomodations = await Accomodation.find({
//       isActive: true,
//       ...capacityFilter,
//       ...locationFilter,
//       ...availabilityFilter,
//     })
//       .populate("reviewsId")
//       .populate("meals");

//     const totalAccomodation = getAccomodations.length;

//     if (!getAccomodations) {
//       return ErrorHandler("Accommodation does not exist", 400, req, res);
//     }

//     return SuccessHandler(
//       {
//         success: true,
//         message: "Fetched successfully",
//         totalAccomodation,
//         getAccomodations,
//       },
//       200,
//       res
//     );
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

// Getting reviews
// const getReviews = async (req, res) => {
//   // #swagger.tags = ['accomodation']
//   try {
//     const { accomodationId } = req.params;
//     const accomodation = await Accomodation.findById(accomodationId).populate({
//       path: "reviewsId",
//       select: "-_id -updatedAt -accomodation -__v",
//       populate: {
//         path: "user",
//         select: "username email avatar",
//       },
//     });
//     if (!accomodation) {
//       return res.status(404).json({ message: "Accommodation not found" });
//     }

//     const reviews = accomodation.reviewsId;

//     let totalRating = 0;
//     for (let rev of reviews) {
//       totalRating += rev.rating;
//     }

//     const avgRating = (totalRating / reviews.length).toFixed(1);

//     return SuccessHandler(
//       {
//         success: true,
//         message: "Fetched Reviews successfully",
//         avgRating,
//         reviews,
//       },
//       200,
//       res
//     );
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

module.exports = {
  createAccomodations,
  getAccomodations,
  // updateAccomodations,
  // deleteAccomodations,
  // getReviews,
};
