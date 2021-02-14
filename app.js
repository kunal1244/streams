/**
 * Application Entry point
 * @type {createApplication}
 */
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const passport = require("passport");
// const redis = require("redis");

const cors = require('cors');


// const REDIS_PORT = process.env.REDIS_PORT || 6379;
// const redisClient = redis.createClient(REDIS_PORT);

// const expressGraphQL = require("express-graphql");
const jwt = require("express-jwt");

const spotifyRouter = require("./routes/spotify");
// const authRouter = require("./routes/auth");
// const lastfmRouter = require("./routes/lastfm");

const User = require("./models/User");


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env (You can remove the path argument entirely, after renaming `.env.example` to `.env`)
 */
dotenv.load({ path: ".env" });

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB, {
  useMongoClient: true,
});
mongoose.connection.on("error", function () {
  console.log(
    "MongoDB Connection Error. Please make sure that MongoDB is running."
  );
  process.exit(1);
});
mongoose.set("debug", true);

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || 3000);


app.use(cors());

app.use(
  bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 5000 })
);
app.use(bodyParser.json({ limit: "50mb" }));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(express.static("client/build"));

app.use("/spotify", spotifyRouter);
// app.use("/auth", authRouter);
// app.use("/lastfm", lastfmRouter);

/**
 * Start Express server.
 */
app.listen(app.get("port"), function () {
  console.log(
    "Express server listening on port %d in %s mode",
    app.get("port"),
    app.get("env")
  );
});

module.exports = app;
