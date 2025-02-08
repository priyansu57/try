if(process.env.NODE_EVN != "production"){
    require('dotenv').config()
}
//  console.log(process.env.CLOUD_NAME) ;
const Listing = require("./models/listing");
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const ejsmate =  require('ejs-mate');
const  ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schemajoi.js");



// authentication perpose code 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const flash = require("connect-flash");
// express-sessions


let atlasdatabase = process.env.ATLASDB_URL;

main().then(() =>{
    console.log("connected to Data Base");
})
.catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(atlasdatabase);
}


// store session relate info 
 
const session = require("express-session");
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl : atlasdatabase,
    crypto :{
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on("error" , ()=>{
    console.log("ERROR IN MONGO SESSION STORAGE",err);
});

const sesssionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave: false ,
    saveUninitialized : true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly : true,
    }
    }
app.use(session(sesssionOptions));
app.use(flash());

 // authentication perpose code implement 

 app.use(passport.initialize());
 app.use(passport.session());

 passport.use(new LocalStrategy(User.authenticate()));

 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.message = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // res.locals.coordinate = Listing.geocoding;
    // console.log(coordinate);
    next();
});

// express-Router
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

const path = require("path"); 

const methodOverride = require('method-override');

app.set("view engine ","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);




// listing validate 



app.use("/listings", listingsRouter);
app.use("/", reviewsRouter);
app.use("/", userRouter)


app.use((err,req,res,next) =>{
    let {status=500,message="something went wrong !!"} =  err;
    res.status(status).render("listings/error.ejs",{err});
})

// app.get("/" ,(req,res) =>{
//     res.send(" I am root");
// });

app.listen(port,() => {
    console.log("Server was Listen from port:",port);
});
