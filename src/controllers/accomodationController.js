const Accomodation = require("../models/Accomodation/accomodation");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const path = require("path");

//Create Accomodations
const createAccomodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  // TODO: image array
  try {
    const {
      title,
      desc,
      latitude,
      longitude,
      capacity,
      services,
      rent,
      } = req.body;

    const getUserId = req.user._id;
    const isAccomodationsExist = await Accomodation.findOne({
      title,
      createdBy: getUserId,
    });

    if (isAccomodationsExist) {
      return ErrorHandler("Accomodation already exist", 400, req, res);
    }

    const newAccomodations = await Accomodation.create({
      title,
      desc,
      rent,
      location: {
        type: "Point",
        coordinates: [latitude, longitude],
      },
      capacity,
      services,
      createdBy: getUserId,
    });

    // newAccomodations.save();

    return SuccessHandler(
      { message: "Added successfully", newAccomodations },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const updateAccomodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  // TODO: image array
  try {
    const { title, desc, latitude, longitude, capacity, services } = req.body;
    console.log(req.body);
    const getUserId = req.user._id;
    const updatedAccomodation = await Accomodation.findByIdAndUpdate(
      req.params.id,
      {
        title,
        desc,
        location: {
          type: "Point",
          cordinates: [latitude, longitude],
        },

        capacity,
        services,
        createdBy: getUserId,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAccomodation) {
      return ErrorHandler("Accomodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      { message: "Updated successfully", updatedAccomodation },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const deleteAccomodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  // TODO: image array
  try {
    console.log(req.body);
    const updatedAccomodation = await Accomodation.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isActive: false,
        },
      }
    );

    if (!updatedAccomodation) {
      return ErrorHandler("Accomodation does not exist", 400, req, res);
    }

    return SuccessHandler({ message: "Deleted successfully" }, 200, res);
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

const getAllAccomodations = async (req, res) => {
  // #swagger.tags = ['accomodation']
  // TODO: image array
  try {
    const capacityFilter = req.body.capacity
      ? {
          capacity: req.body.capacity,
        }
      : {};

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

        console.log(locationFilter)

    //   {
    //     <location field>: {
    //       $near: {
    //         $geometry: {
    //            type: "Point" ,
    //            coordinates: [ <longitude> , <latitude> ]
    //         },
    //         $maxDistance: <distance in meters>,
    //         $minDistance: <distance in meters>
    //       }
    //     }
    //  }

    const getAccomodations = await Accomodation.find({
      isActive: true,
      ...capacityFilter,
      ...locationFilter,
    }).populate("reviewsId");
    const totalAccomodation = getAccomodations.length

    if (!getAccomodations) {
      return ErrorHandler("Accomodation does not exist", 400, req, res);
    }

    return SuccessHandler(
      { message: "Fetched successfully", getAccomodations, totalAccomodation },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


//Saved  Accomodations
// const savedOrUnsavedAccomodations = async (req, res) => {

//   // #swagger.tags = ['accomodation']
//   try {
//     const { title, desc, latitude, longitude, capacity, services } = req.body;
//     console.log(req.body);
//     const getUserId = req.user._id;

//     const isAccomodationsExist = await Accomodation.findOne({

//       title,
//       createdBy: getUserId,
//     });

//     if (isAccomodationsExist) {
//       return ErrorHandler("Accomodation already exist", 400, req, res);
//     }

//     const newAccomodations = await Accomodation.create({
//       title,
//       desc,
//       location: {
//         type: "Point",
//         cordinates: [latitude, longitude],
//       },
//       capacity,
//       services,
//       createdBy: getUserId,
//     });

//     // newAccomodations.save();

//     return SuccessHandler(
//       { message: "Added successfully", newAccomodations },
//       200,
//       res
//     );
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };



module.exports = {
  createAccomodations,
  updateAccomodations,
  deleteAccomodations,
  getAllAccomodations,
};
