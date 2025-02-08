const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing");
const asyncWrap = require("../utils/asyncWrap");
const {isLogin,isOwner,validateListing} = require("../middleware");
const listingController = require("../controllers/listingcont");

// image upload criteria
const multer  = require('multer')
const {storage} = require("../cloudconfig");
const upload = multer({ storage});


//Index Routs
router.get("/", asyncWrap(listingController.index));
 
 // create new Route
 router.get("/new",isLogin, listingController.createlistings);
 
 router.post("/", upload.single("listing[image]"),isLogin,asyncWrap(listingController.postlistings));

 
 //show Routs
 router.get("/:id",asyncWrap(listingController.showlistings));
 
 
 //Edit Routs
 router.get("/:id/edit",isLogin,isOwner,asyncWrap(listingController.Editlistings));
 

 //update router
 router.put("/:id",upload.single("listing[image]"),isOwner,asyncWrap( listingController.updatelistings)); 
 
 
 //delete Routs
 router.delete("/:id", isLogin,isOwner,asyncWrap(listingController.deletelistings));
 module.exports = router;
  