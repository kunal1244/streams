const SpotifyWebApi = require("spotify-web-api-node");
const spotify_graphql = require('spotify-graphql');
const apiQuery = require('../graphql/queries');

const scopes = [
	"user-read-private",
	"user-read-email",
	"user-library-read",
	"user-read-recently-played",
	"user-follow-read",
	"user-top-read",
];

require("dotenv").config();

let spotifyConfig = {
	clientId: process.env.SPOTIFY_API_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.SPOTIFY_CALLBACK_URL,
}

var spotifyApi = new SpotifyWebApi(spotifyConfig);

function setTokens(){
	spotifyConfig.accessToken = "BQAy3zPTPwEYak73TjGzrCm0Dyu-9eJhoLR357URbc_v5c9rWZGqtB6pLrVkLv1RKtkPNHD7JdxnJGNaDsZpb8gRSCfVUcRSJmw3pKCfB06m2-jw0Rnmmx9i2dgkg0PJVV8I4_cIVWedFWXVy9nUlHyG8r7FQWRgvJa7tA2EA93a6X10K_kJe7idj_dLAB0hnTYhP4yeQ18tfxglfmwMfkV7bbyO7XJtBl5AcDEagx5ypPnxwn40XxWEIrmi_-f085Ds2A";
}

exports.login = (req, res) => {
	var html = spotifyApi.createAuthorizeURL(scopes);
	res.redirect(html + "&show_dialog=true");
};

exports.callback = async (req, res) => {
	const { code } = req.query;
	try {
		var data = await spotifyApi.authorizationCodeGrant(code);
		const { access_token, refresh_token } = data.body;
		spotifyApi.setAccessToken(access_token);
		spotifyApi.setRefreshToken(refresh_token);
		console.log(access_token + "         " + refresh_token);
		res.redirect("http://localhost:3000");
	} catch (err) {
		res.redirect("/#/error/invalid token");
	}
};

function getData(req, res) {
	setTokens()
	const apiData = await spotify_graphql.SpotifyGraphQLClient(spotifyConfig).query(apiQuery);
	getUserGenres(apiData);
}

function getArtistsandGenres(apiData){
	let artistData = {};
	let genreData = {
		"artists" : [],
		"genres" : {}
	};
	apiData.me.artists.forEach(artist => {
		let temp = artist;
		delete temp.id;
		delete temp.genres;
		if(!genreData.artists.includes(artist.id)){
			genreData.artists.push(artist.id);
			artist.genres.forEach(genre => {
				if(genreData.genres[genre] != undefined) genreData.genres[genre]++;
				else genreData.genres[genre] = 1;
			})
		}
	});
}

function getArtists (apiData) {
	try {
		// const genreData = await spotify_graphql.SpotifyGraphQLClient(spotifyConfig)
		// .query(`{
		// 	me {
		// 		artists {
		// 		  genres
		// 		}
		// 	  }
		//   }
		// `)
		let genres = {};
		genreData.data.me.artists.forEach(item => {
			item.genres.forEach(genre => {
				if(genres[genre] != undefined) genres[genre]++;
				else genres[genre] = 1;
			})
		})
		let genres_categorized = {
			"pop": {
				"count" : 0,
				"types" : []
			},
			"rock": {
				"count" : 0,
				"types" : []
			},
			"metal": {
				"count" : 0,
				"types" : []
			},
			"hip hop": {
				"count" : 0,
				"types" : []
			},
			"edm": {
				"count" : 0,
				"types" : []
			},
			"folk": {
				"count" : 0,
				"types" : []
			},
			"jazz": {
				"count" : 0,
				"types" : []
			},
			"bollywood": {
				"count" : 0,
				"types" : []
			},
			"reggae": {
				"count" : 0,
				"types" : []
			},
			"indie": {
				"count" : 0,
				"types" : []
			},
			"others": {
				"count" : 0,
				"types" : []
			},
		};
		for(let key of Object.keys(genres)){
			if(key.includes("pop")){
				genres_categorized["pop"].count += genres[key];
				genres_categorized["pop"].types.push(key);
			}
			else if(key.includes("rock") || key.includes("punk")){
				genres_categorized["rock"].count += genres[key];
				genres_categorized["rock"].types.push(key);
			}
			else if(key.includes("metal") || key.includes("grunge")){
				genres_categorized["metal"].count += genres[key];
				genres_categorized["metal"].types.push(key);
			}
			else if(key.includes("hip hop") || key.includes("rap") || key.includes("g funk")){
				genres_categorized["hip hop"].count += genres[key];
				genres_categorized["hip hop"].types.push(key);
			}
			else if(key.includes("edm") || key.includes("electro") || key.includes("dance") || key.includes("house") || key.includes("room")){
				genres_categorized["edm"].count += genres[key];
				genres_categorized["edm"].types.push(key);
			}
			else if(key.includes("folk") || key.includes("sufi")){
				genres_categorized["folk"].count += genres[key];
				genres_categorized["folk"].types.push(key);
			}
			else if(key.includes("jazz") || key.includes("blues") || key.includes("r&b")){
				genres_categorized["jazz"].count += genres[key];
				genres_categorized["jazz"].types.push(key);
			}
			else if(key.includes("bollywood") || key.includes("filmi")){
				genres_categorized["bollywood"].count += genres[key];
				genres_categorized["bollywood"].types.push(key);
			}
			else if(key.includes("reggae")){
				genres_categorized["reggae"].count += genres[key];
				genres_categorized["reggae"].types.push(key);
			}
			else if(key.includes("indie") || key.includes("soul")){
				genres_categorized["indie"].count += genres[key];
				genres_categorized["indie"].types.push(key);
			}
			else{
				genres_categorized["others"].count += genres[key];
				genres_categorized["others"].types.push(key);
			}
		}

		
		res.status(200).json(genres_categorized);
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
}
