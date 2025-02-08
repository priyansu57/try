const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const  ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schemajoi.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLogin,isReviewauthor,validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviewcont.js");

// Review Rout 

router.post("/listings/:id/reviews", isLogin,validateReview,asyncWrap(reviewController.createReviews ));

// DElete review 

router.delete("/listings/:id/reviews/:reviewId", isReviewauthor,isLogin,asyncWrap(reviewController.deleteReview));

module.exports = router ;