const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schemajoi");
const  ExpressError = require("./utils/ExpressError");


module.exports.isLogin= (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be login");
         return res.redirect("/login");
       }
       next();
};

module.exports.saveRedirecturl = (req,res,next) =>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl;
    }
   next();
};



// module.exports.isReviewauthor = async (req,res,next) =>{
//     let { reviewId } = req.params;
// let  review =  await Review.findById(reviewId);
// //  console.log(listing.owner);
//  if( !review.author.equals(res.locals.currUser._id)){
//     req.flash("error", "you are not owner of the listing");
//    return res.redirect(`/listings/${id}`);
//  }
//  req.flash("success", "authod match and review delete");
//  next();
// }

module.exports.isOwner = module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      // Find the listing by its ID
      const listing = await Listing.findById(id);
  
      // If the listing is not found, redirect with an error message
      if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
      }
  
      // Check if the current user is the owner of the listing
      if (!listing.owner[0] .equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
      }
  
      // Proceed to the next middleware or route handler if the user is the owner
      next();
  
    } catch (err) {
      // Handle any errors that occur during the database operation
      console.error(err);
      req.flash("error", "An error occurred while checking ownership.");
      res.redirect("/listings");
    }
  };
  

 module.exports.isReviewauthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
  
    try {
      // Find the listing by its ID
      const review = await Review.findById(reviewId);
  
      // If the listing is not found, redirect with an error message
      if (!review) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
      }
  
        console.log(res.locals.currUser._id);
        console.log(review.author);
      // Check if the current user is the owner of the listing
      if (!review.author .equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
      }
  
      // Proceed to the next middleware or route handler if the user is the owner
      next();
  
    } catch (err) {
      // Handle any errors that occur during the database operation
      console.error(err);
      req.flash("error", "An error occurred while checking ownership.");
      res.redirect("/listings");
    }
  };
  

 module.exports.validateListing = (req,res,next) =>{
    let {error}  = listingSchema.validate(req.body);
    if(error){
      let errmsg = error.details.map((err) => err.message).join(",")
      throw new ExpressError (400, errmsg); 
  }
  else{
      next();
  } 
    
};

// validereview checker
module.exports. validateReview = (req,res,next) =>{
    let { error}  = reviewSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((err) => err.message).join(",")
        throw new ExpressError (400, errmsg); 
    }
    else{
        next();
    } 
}