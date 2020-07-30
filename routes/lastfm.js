var express = require("express");
const LastFMController = require("../controllers/LastFMController");

require("dotenv").config();

var LastFmNode = require("lastfm").LastFmNode;

var lastfm = new LastFmNode({
  api_key: process.env.LASTFM_API_KEY, // sign-up for a key at http://www.last.fm/api
  secret: process.env.LASTFM_API_SECRET,
});

const trackStream = lastfm.stream("humblebumble_");

trackStream.on("lastPlayed", function (track) {
  console.log("Last played: " + track.name);
});

trackStream.on("nowPlaying", function (track) {
  console.log("Now playing: " + track.name);
});

trackStream.on("scrobbled", function (track) {
  console.log("Scrobbled: " + track.name);
});

trackStream.on("stoppedPlaying", function (track) {
  console.log("Stopped playing: " + track.name);
});

trackStream.on("error", function (error) {
  console.log("Error: " + error.message);
});

trackStream.start();

var session = lastfm.session({
  token: token,
  handlers: {
    success: function (session) {
      lastfm.update("nowplaying", session, { track: track });
      lastfm.update("scrobble", session, { track: track, timestamp: 12345678 });
    },
  },
});

var request = lastfm.request("artist.getInfo", {
  artist: "The Mae Shi",
  handlers: {
    success: function (data) {
      console.log("Success: " + data);
    },
    error: function (error) {
      console.log("Error: " + error.message);
    },
  },
});
