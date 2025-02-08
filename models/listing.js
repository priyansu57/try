const mongoose = require("mongoose");
 const Review = require("./review.js");

const { types, required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description: String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ], 
    owner: [
        {
            type : Schema.Types.ObjectId,
            ref: "User",
        },
    ], 
    Geocoding:  {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          
        },
        coordinates: {
          type: [Number],
           
        }
      }
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    console.log(listing.reviews);
    if(listing){
    await Review.deleteMany({_id : {$in:  listing.reviews }});
    }
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;

