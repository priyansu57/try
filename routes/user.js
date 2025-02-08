const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncWrap = require("../utils/asyncWrap");
const user = require("../models/user");
const passport = require("passport");
const {saveRedirecturl} = require("../middleware");
const userController = require("../controllers/usercont");

// Signup in webpage

router.route("/signup") // you joining the common path into the a single path using router.route
.get(userController.rendersignupform)
.post( asyncWrap(userController.signupRegister)); 

// // Signup in webpage
// router.get("/signup", userController.rendersignupform);

// // register user in db and wanderlust 
// router.post("/signup", asyncWrap(userController.signupRegister));


router.route("/login")
  .get( userController.renderLoginform)
  .post( saveRedirecturl,passport.authenticate("local",{failureRedirect : "/login" , failureFlash: true}),userController.Login);


router.get("/logout", userController.Logout);

module.exports = router;