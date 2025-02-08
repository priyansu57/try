const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing");

//  for map 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const { query } = require("express");
 const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index =async (req,res) =>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
 };

module.exports.createlistings = (req,res) =>{
    res.render("listings/new.ejs")
}; 
  
module.exports.postlistings = async (req,res,next) =>{
   
    let response = await geocodingClient.forwardGeocode({
        query : req.body.listing.location,
        limit : 1,
    })
    .send();

    let coordinate =   response.body.features[0].geometry;
    let url = req.file.path;
    let filename = req.file.filename;

     let listing = new Listing(req.body.listing);

     
     listing.Geocoding = coordinate;
     
         listing.owner = req.user._id;
         listing.image = {url,filename};
         let save = await listing.save();
      console.log(save);
       req.flash("success", "Listing is created successfully");
       res.redirect("/listings");      
};    


module.exports.showlistings = async( req,res) =>{
    let {id} = req.params;
   const listing =  await Listing.findById(id)
   .populate({
    path :"reviews" , 
    populate : {
        path : "author",  // nested populate
    }
     })
   .populate("owner"); 

   const originaimage = listing.image.url;
   const  originaimage1 = originaimage.replace("/upload" ,"/upload/w_250");

   if(!listing){
    req.flash("error", "Listing is not Detected");
    res.redirect("/listings");
 }         

     res.render("listings/show.ejs",{listing,originaimage1});
 };


 module.exports.Editlistings = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
       req.flash("error", "Listing is not Detected");
       res.redirect("/listings");
    }          
    
    // it for blur image
    const originaimage = listing.image.url;
   const  originaimage1 = originaimage.replace("/upload" ,"/upload/w_250");
    res.render("listings/edit.ejs",{listing, originaimage1});
    
};


module.exports.updatelistings = async (req,res) =>{
    let {id} = req.params;
    let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
      
     if( typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
     }

     req.flash("success", "Listing  succesfully Edited");
    res.redirect(`/listings/${id}`);
};


module.exports.deletelistings = async (req,res) =>{
     let {id} = req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success", "Listing  succesfully Deleted");
     res.redirect("/listings");
 };

