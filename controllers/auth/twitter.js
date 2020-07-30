var passport = require("passport"),
  TwitterStrategy = require("passport-twitter").Strategy;
var User = require("../../models/User");

require("dotenv").config();

passport.serializeUser(function (user, fn) {
  fn(null, user);
});

passport.deserializeUser(function (id, fn) {
  User.findOne({ _id: id.doc._id }, function (err, user) {
    fn(err, user);
  });
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        { name: profile.displayName },
        { name: profile.displayName, userid: profile.id },
        function (err, user) {
          if (err) {
            console.log(err);
            return done(err);
          }
          done(null, user);
        }
      );
    }
  )
);

module.exports = passport;
