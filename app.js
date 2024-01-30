require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const expError = require("./utils/expressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    age: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  // res.send("Hi, I am root");
  res.redirect("listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);

// app.get("/demouser", async (req, res) => {
//   let fakeUser = {
//     email: "fake@gmail.com",
//     username: "fakerrr111",
//   };

//   let registerdUser = await User.register(fakeUser, "mypassword");
//   res.send(registerdUser);
// });

app.all("*", (req, res, next) => {
  next(new expError(404, "Page not found!!"));
});

// handle exception by using the try catch
// app.use((err, req, res, next) => {
//   res.send("somthing went wrong");
// });

// error handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("listings/error", { err });
});

app.listen(8080, () => {
  console.log(
    "Server is listening on port 8080\nhttp://127.0.0.1:8080/listings"
  );
});
