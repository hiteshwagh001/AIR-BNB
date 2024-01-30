const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const expError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const reviewController = require("../Controller/reviewController.js");

const {
  validReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares.js");

// review section
// post review
router.post(
  "/",
  isLoggedIn,
  validReview,
  wrapAsync(reviewController.postReview)
);

// delete review and from listing
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
