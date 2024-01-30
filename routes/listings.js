const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing, isLoggedIn, isOwner } = require("../middlewares.js");
const listingController = require("../Controller/listingsController.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route
router.get("/", wrapAsync(listingController.index));

router.get("/new", isLoggedIn, listingController.newListings);

router.get("/:id", wrapAsync(listingController.openListing));

router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.postListing)
);

// router.post("/", upload.single("listing[image]"), (req, res) => {
//   res.send(req.file);
// });

//edit
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.getEditListing)
);

// router.put(
//   "/listing/:id",
//   validateListing,
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let result=await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
//     console.log(result)
//     res.redirect(`/listings/${id}`);
//   })
// );

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.postEditListing)
);

//delete listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
