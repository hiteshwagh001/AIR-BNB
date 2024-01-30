const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middlewares.js");


module.exports.signUpUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      // res.redirect("/listings");

      res.redirect(res.locals.redirectUrl || "/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.getLogin = (req, res) => {
  res.render("users/login");
};

module.exports.postLogin = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  console.log(res.locals.redirectUrl);
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are successfully Logged out");
    res.redirect("/listings");
    // res.redirect(req.locals.redirectUrl);
  });
};
