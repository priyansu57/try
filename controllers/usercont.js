const User = require("../models/user");
const passport = require("passport");

module.exports.rendersignupform = (req,res) =>{
    res.render("User/signup.ejs");
};

module.exports.signupRegister = async(req,res) =>{
    try{
        let{username,email,password} = req.body;
        const newuser = new User({username,email});
         let registeruser = await User.register(newuser, password);
         console.log(registeruser);
         req.login(registeruser, (err) =>{
            if(err){
            return next(err);
            }
            req.flash("success", "Welcome to Wonderlust");
         res.redirect("/listings");
         });     
    }catch(error){
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginform  = (req,res) =>{
    res.render("User/login.ejs");
};

module.exports.Login = async(req,res) =>{
    
    req.flash("success", "Successfully Login");
  let redirecturl=  res.locals.redirectUrl || "/listings"
     res.redirect(redirecturl);   
};

module.exports.Logout = (req,res) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "you logged out !!")
        res.redirect("/login");
    })
};
