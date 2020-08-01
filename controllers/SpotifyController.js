const SpotifyWebApi = require("spotify-web-api-node");

const scopes = [
	"user-read-private",
	"user-read-email",
	"playlist-modify-public",
	"playlist-modify-private",
	"user-library-read",
	"user-read-recently-played",
	"user-follow-read",
	"user-top-read",
];

require("dotenv").config();


var spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_API_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.SPOTIFY_CALLBACK_URL,
});


function setTokens(){
	spotifyApi.setAccessToken("BQAEw3Mq1cm3buGSjmc9aVHKi3jp1mRcYmmomAJaKc3lshZP6kb5H4wWKjlugzWJm8PJTabfkC4wpuUnvLkHnePE1P-2lpR2F0w5-2QI3fU4JlRjVjJRxB_GCxZ6akmbX9JQO_SRNrS3qSHuYASDVJJTwLYKEM9I-3D_CJKtHK0LYyMCfdU73_DxBm1z9ushL_Gq5xk6tU_14pglMWXXbRXAoYnbu9iodGErL85DnTPr5mn1MyaQvjvum7uWIg5TqaKaZg");
	spotifyApi.setRefreshToken("AQCnXt4jUKRGPhwvxrCdSqIM61NDoqQlNxJK99PGhm2lpZ3LZZpkgjqUYSi5s5Fnal7M5Nl7brGlOmthphY1y3EfGjD9QWxQmCBjps_QITAZShhFIwS162IhDEu73izgQZQ");
}

async function getData(){
	try{

		let apiFollowedArtistsData = [], followedArtists = [];
		const data = await spotifyApi.getFollowedArtists( { limit : 50 } );
		apiFollowedArtistsData.push(data);
		let last_id;
		if(data.body.artists.items.length == 50) last_id = data.body.artists.items[49].id;
		
		const totalArtists = data.body.artists.total;
		
		for(let i = 1; i <= totalArtists / 50; i++){
			const temp_data = await spotifyApi.getFollowedArtists( { limit : 50, after : last_id } );
			apiFollowedArtistsData.push(temp_data);
			
			if(temp_data.body.artists.items.length == 50) last_id = temp_data.body.artists.items[49].id;
		}
		
		let followedArtistsData = [];
		apiFollowedArtistsData.forEach(element => {
			element.body.artists.items.forEach(item => {
				followedArtistsData.push(item);
			})
		});
		
		const genres = {};
		followedArtistsData.forEach(item => {
			item.genres.forEach(genre => {
				if(genres[genre] != undefined) genres[genre]++;
				else genres[genre] = 1;
			});
			let artist = {"name": item.name};
			artist["images"] = item.images.slice(-1)[0]["url"];
			followedArtists.push(artist) ;
		});




		return genres;
	} catch(err) {
		console.log(err);
	}
	
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

exports.userInfo = async (req, res) => {
	try {
		setTokens();
		var result = await spotifyApi.getMe();
		res.status(200).send(result.body);
	} catch (err) {
		res.status(400).send(err);
	}
};

exports.getUserAlbums = async (req, res) => {
	try {
		setTokens();
		var result = await spotifyApi.getMySavedAlbums();
		res.status(200).send(result.body);
	} catch (err) {
		res.status(400).send(err);
	}
};

exports.getUserGenres = async (req, res) => {
	try {
		setTokens();
		const genres = await getData();
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
