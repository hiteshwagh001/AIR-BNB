const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../Controller/userController.js");

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", saveRedirectUrl, wrapAsync(userController.signUpUser));

router.get("/login", userController.getLogin);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.postLogin
);

router.get("/logout", userController.logoutUser);

module.exports = router;
