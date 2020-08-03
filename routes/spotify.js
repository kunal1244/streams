var express = require("express");
const SpotifyController = require("../controllers/SpotifyController");

var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", SpotifyController.login);

router.get("/cb", SpotifyController.callback);

// router.get("/userinfo", SpotifyController.userInfo);

// router.get("/albums", SpotifyController.getUserAlbums);

router.get("/data", SpotifyController.getData);

module.exports = router;
