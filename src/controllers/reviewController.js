const Review = require("../models/Review/review");
const SuccessHandler = require("../utils/SuccessHandler");
const ErrorHandler = require("../utils/ErrorHandler");
const Accomodation = require("../models/Accomodation/accomodation");
const path = require("path");

//Add a new Review
const addReviews = async (req, res) => {
  // #swagger.tags = ['review']
  try {
    const accomodationId = req.param.id;
    const { rating, comment } = req.body;
    if (req.user.role ==='user') {
      
      const review = new Review({
      rating,
      comment,
      userId: req.user._id,
    });
    
    await review.save();

    await Accomodation.findByIdAndUpdate(req.params.id, {
      $push: { reviewsId: review._id },
    });


    
    return SuccessHandler(
      { message: "Reviews Added successfully", review },
      200,
      res
      );
    }

    else{
      return ErrorHandler("Unauthorized User", 400, req, res);
    }


  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


const gettingReviews = async (req, res) => {
  // #swagger.tags = ['review']
  try {
    const accomodationId = req.params.id;
    if (req.user.role ==='user') {
    

      const accomodationReviews = await Review.find();
      console.log(accomodationReviews);
      if (accomodationReviews.length === 0) {
        return res.status(404).json({ message: 'No reviews found for this product' });
      }
    

    
    return SuccessHandler(
      { message: "Fetched Reviews successfully", accomodationReviews },
      200,
      res
      );
    }

    else{
      return ErrorHandler("Unauthorized User", 400, req, res);
    }


  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};


module.exports = {
  addReviews,
  gettingReviews,
};
