const Listing = require("./models/listing");
const Review = require("./models/review.js");
const expError = require("./utils/expressError.js");
const { reviewSchema,listingSchema } = require("./schema.js");


module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body.listing);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    // Customize the response based on your needs
    throw new expError(400, error);
  } else {
    next();
  }
};

module.exports.validReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    // Customize the response based on your needs
    throw new expError(400, error);
  } else {
    next();
  }
};



module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in !");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission for this Listing ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id ,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
