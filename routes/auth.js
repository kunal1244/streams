var express = require("express");
var router = express.Router();
var passportFacebook = require("../controllers/auth/facebook");
var passportTwitter = require("../controllers/auth/twitter");
var passportGoogle = require("../controllers/auth/google");
var passportGitHub = require("../controllers/auth/github");
var User = require("../models/User");

/* LOGIN ROUTER */
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Please Sign In with:" });
});

/* LOGOUT ROUTER */
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

/* FACEBOOK ROUTER */
router.get("/facebook", passportFacebook.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passportFacebook.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

/* TWITTER ROUTER */
router.get("/twitter", passportTwitter.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passportTwitter.authenticate("twitter", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/dashboard");
  }
);

/* GOOGLE ROUTER */
router.get(
  "/google",
  passportGoogle.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);

router.get(
  "/google/callback",
  passportGoogle.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/dashboard");
  }
);

/* GITHUB ROUTER */
router.get(
  "/github",
  passportGitHub.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passportGitHub.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

module.exports = router;
