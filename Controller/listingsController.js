const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding.js");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    // res.send("hey")
    // console.log(allListings);
    res.render("listings/index", { allListings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).render("listings/error", { error });
  }
};

module.exports.newListings = (req, res) => {
  res.render("listings/new");
};

module.exports.openListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested is no longer exists");
    res.redirect("/listings");
  }
  //   console.log(listing);
  res.render("listings/show", { listing });
};

module.exports.postListing = async (req, res, next) => {
  // if (!req.body.listing) {
  //   throw new expError(400, "Send valid data for the Listing");
  // }
  // const result = listingSchema.validate(req.body);
  // // console.log(result);
  // if (result.error) {
  //   throw new expError(400, result.error);
  // }
  // let result = listingSchema.validate(req.body.listing);
  // console.log(result);

  let response = await geocodingClient
    .forwardGeocode({
      query: "New Delhi, India",
      limit: 1,
    })
    .send();

  console.log(response);
  // res.send("Done!!");

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New listing created");
  console.log("data saved!!");
  res.redirect("/listings");
};

module.exports.getEditListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested is no longer exists");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.postEditListing = async (req, res) => {
  const { id } = req.params;

  // Use req.body.listing instead of req.body.Listing
  const result = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    result.image = { url, filename };
    await image.save();
  }

  // Check if the result is null, indicating that the listing with the given ID was not found
  if (!result) {
    res.status(404);
    req.flash("error", "Lisiting is not found");
    res.redirect("/listings");
  }

  //   console.log(result);
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
