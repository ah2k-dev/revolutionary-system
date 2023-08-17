const bookAccomm = require("../models/BookingAccomodation/bookingAccomodation");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Accomodation = require("../models/Accomodation/accomodation");
const path = require("path");

//Book a new Accomm
const bookNewAccomm = async (req, res) => {
  const currentUser = req.user._id
  try {
    const accomodationId = req.params.id;
    const { 
        startDate,
        endDate,
        subTotal,

     } = req.body;
     
    if (req.user.role === "user") {
      const currentAccommodation = await Accomodation.findById(accomodationId); 
      console.log(currentAccommodation);

      if (!currentAccommodation) {
        return ErrorHandler("Accommodation Does not exist", 400, req, res);
      }

    // let stripeChargesInPercent = 0.3
    // let stripeChargesAmount = stripeChargesInPercent*100
    // let totalAmount = (stripeChargesAmount)+  subTotal
    
    const isBooked =  await bookAccomm.find()
    isBooked.accomodationsId.includes(accodID)

    const newBooking = await bookAccomm.create({
        user: currentUser,
        accomodationsId: [accomodationId],
        bookingDate:{
            startDate,
            endDate,
        },
        subTotal,
    })

    await newBooking.save()

      return SuccessHandler(
        { message: "Booking Added successfully", newBooking },
        200,
        res
      );
    } else {
      return ErrorHandler("Unauthorized User", 400, req, res);
    }
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


const getUserBookings = async (req, res) => {
    const currentUser = req.user._id
    // #swagger.tags = ['review']
    try {
      if (req.user.role === "user") {
  
          
          const bookings =  await bookAccomm.findById(currentUser)
          console.log(bookings);
          if (!bookings) {
            return ErrorHandler("No Such Booking exist", 400, req, res);
          }
          
   
        return SuccessHandler(
          { message: "Booking Added successfully", bookings },
          200,
          res
        );
      } else {
        return ErrorHandler("Unauthorized User", 400, req, res);
      }
    } catch (error) {
      return ErrorHandler(error.message, 500, req, res);
    }
  };


// const gettingReviews = async (req, res) => {
//   // #swagger.tags = ['review']
//   try {
//     const accomodationId = req.params.id;
//     if (req.user.role === "user") {
//       // console.log(accomodationId);
//       const accomodation = await Accomodation.findById(accomodationId).populate(
//         "reviewsId"
//       );
//       const reviews = accomodation.reviewsId;

//       let totalRating = 0;
//       for (let rev of reviews) {
//         totalRating += rev.rating;
//       }

//       const avgRating = (totalRating / reviews.length).toFixed(1);

//       console.log(reviews);
//       if (!accomodation) {
//         return res.status(404).json({ message: "Accomodation not found" });
//       }
//       if (accomodation.length === 0) {
//         return res
//           .status(404)
//           .json({ message: "No reviews found for this product" });
//       }

//       return SuccessHandler(
//         { message: "Fetched Reviews successfully", avgRating, reviews },
//         200,
//         res
//       );
//     } else {
//       return ErrorHandler("Unauthorized User", 400, req, res);
//     }
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

module.exports = {
    bookNewAccomm,
    getUserBookings,
};
