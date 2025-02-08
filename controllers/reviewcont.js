const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReviews = async(req,res) => {
    // console.log(req.params.id);
    // let {id} = req.params;
    let listing = await Listing.findById(req.params.id);
    console.log(listing);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; 
    console.log(newReview.author);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review's succesfully Edited");
     res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    
   await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review's succesfully Deleted");
    res.redirect(`/listings/${id}`);
    
};
