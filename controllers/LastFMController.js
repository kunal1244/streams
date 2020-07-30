var LastFmNode = require("lastfm").LastFmNode;

var lastfm = new LastFmNode({
  api_key: "fdb1cd117a76596aad3131889a393a03", // sign-up for a key at http://www.last.fm/api
  secret: "a7d95f47f334db49141516f6dc105145",
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

// var session = lastfm.session({
//   token: token,
//   handlers: {
//     success: function (session) {
//       lastfm.update("nowplaying", session, { track: track });
//       lastfm.update("scrobble", session, { track: track, timestamp: 12345678 });
//     },
//   },
// });

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
