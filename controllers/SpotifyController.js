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
	spotifyConfig.accessToken = ""
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
		spotifyConfig.accessToken = access_token;
		spotifyApi.setAccessToken(access_token);
		spotifyApi.setRefreshToken(refresh_token);
		console.log(access_token + "         " + refresh_token);
		res.redirect("http://localhost:3000");
	} catch (err) {
		res.redirect("/#/error/invalid token");
	}
};

exports.getData = async (req, res) => {
	try{
		// setTokens()
		const apiData = await spotify_graphql.SpotifyGraphQLClient(spotifyConfig).query(apiQuery.dataQuery);
		const { artists, genres } = getArtistsandGenres(apiData.data);
		const { albums } = getAlbums(apiData.data);
		const response = { 
			"artists": artists,
			"genres": genres,
			"albums": albums
		};
		res.status(200).json(response);
	} catch(err) {
		console.log("error: ", err);
		res.status(400).json(err);
	}
}

function getAlbums(apiData){
	let albumData = {};
	apiData.me.albums.forEach(album_ => {
		let album = album_.album;
		let temp = {
			"id": album.id,
			"name": album.name,
			"images": album.images,
			"count": 5
		}
		if(albumData[album.id] == undefined) albumData[album.id] = temp;	
		else albumData[album.id].count += 5;
	});

	apiData.me.tracks.forEach(track_ => {
		let track = track_.track;
		if(albumData[track.album.id] == undefined){
			albumData[track.album.id] = {
				"id": track.album.id,
				"name": track.album.name,
				"images": null,
				"count": 1
			};
		}	
		else albumData[track.album.id].count++;
	});

	apiData.me.top_tracks.forEach(track => {
		if(albumData[track.album.id] == undefined){
			albumData[track.album.id] = {
				"id": track.album.id,
				"name": track.album.name,
				"images": null,
				"count": 1
			};
		}	
		else albumData[track.album.id].count++;
	});

	apiData.me.playlists.forEach(playlist => {
		playlist.tracks.forEach(track_ => {
			let track = track_.track;
			if(albumData[track.album.id] == undefined){
				albumData[track.album.id] = {
					"id": track.album.id,
					"name": track.album.name,
					"images": null,
					"count": 1
				};
			}	
			else albumData[track.album.id].count++;
		});
	});

	let albums = Object.values(albumData);

	albums.sort(function(a, b) {
		return b.count - a.count;
	});

	return {albums: albums};
}

function getArtistsandGenres(apiData){
	let artistData = {};
	let genreData = {
		"artists" : [],
		"genres" : {}
	};
	apiData.me.artists.forEach(artist => {
		let temp = {
			"id": artist.id,
			"name": artist.name,
			"images": artist.images,
			"count": 10
		}
		if(artistData[artist.id] == undefined) artistData[artist.id] = temp;
		else artistData[artist.id].count += 10;

		if(!genreData.artists.includes(artist.id)){
			genreData.artists.push(artist.id);
			artist.genres.forEach(genre => {
				if(genreData.genres[genre] != undefined) genreData.genres[genre]++;
				else genreData.genres[genre] = 1;
			});
		}
	});

	apiData.me.top_artists.forEach(artist => {
		let temp = {
			"id": artist.id,
			"name": artist.name,
			"images": artist.images,
			"count": 5
		}

		if(artistData[artist.id] == undefined) artistData[artist.id] = temp;
		else artistData[artist.id].count += 5;

		if(!genreData.artists.includes(artist.id)){
			genreData.artists.push(artist.id);
			artist.genres.forEach(genre => {
				if(genreData.genres[genre] != undefined) genreData.genres[genre]++;
				else genreData.genres[genre] = 1;
			});
		}
	});

	apiData.me.albums.forEach(album_ => {
		let album = album_.album;
		album.artists.forEach(artist => {
			if(artistData[artist.id] == undefined){
				artistData[artist.id] = {
					"id": artist.id,
					"name": artist.name,
					"images": null,
					"count": 3
				};
			}	
			else artistData[artist.id].count += 3;
		})
	});

	apiData.me.tracks.forEach(track_ => {
		let track = track_.track;
		track.artists.forEach(artist => {
			if(artistData[artist.id] == undefined){
				artistData[artist.id] = {
					"id": artist.id,
					"name": artist.name,
					"images": null,
					"count": 1
				};
			}	
			else artistData[artist.id].count++;
		})
	});

	apiData.me.top_tracks.forEach(track => {
		track.artists.forEach(artist => {
			if(artistData[artist.id] == undefined){
				artistData[artist.id] = {
					"id": artist.id,
					"name": artist.name,
					"images": null,
					"count": 1
				};
			}	
			else artistData[artist.id].count++;
		})
	});

	apiData.me.playlists.forEach(playlist => {
		playlist.tracks.forEach(track_ => {
			let track = track_.track;
			track.artists.forEach(artist => {
				if(artistData[artist.id] == undefined){
					artistData[artist.id] = {
						"id": artist.id,
						"name": artist.name,
						"images": null,
						"count": 1
					};
				}	
				else artistData[artist.id].count++;
			})
		});
	});

	const genres_categorized = categorizeGenres(genreData.genres);

	let genres = Object.values(genres_categorized);

	genres.sort(function(a, b) {
		return b.count - a.count;
	});

	let artists = Object.values(artistData);

	artists.sort(function(a, b) {
		return b.count - a.count;
	});

	return {artists: artists, genres: genres};
}

function categorizeGenres(genres) {
	try {
		let genres_categorized = {
			"pop": {
				"genre" : "pop",
				"count" : 0,
				"types" : []
			},
			"rock": {
				"genre" : "rock",
				"count" : 0,
				"types" : []
			},
			"metal": {
				"genre" : "metal",
				"count" : 0,
				"types" : []
			},
			"hip hop": {
				"genre" : "hip hop",
				"count" : 0,
				"types" : []
			},
			"edm": {
				"genre" : "edm",
				"count" : 0,
				"types" : []
			},
			"folk": {
				"genre" : "folk",
				"count" : 0,
				"types" : []
			},
			"jazz": {
				"genre" : "jazz",
				"count" : 0,
				"types" : []
			},
			"bollywood": {
				"genre" : "bollywood",
				"count" : 0,
				"types" : []
			},
			"reggae": {
				"genre" : "reggae",
				"count" : 0,
				"types" : []
			},
			"indie": {
				"genre" : "indie",
				"count" : 0,
				"types" : []
			},
			"others": {
				"genre" : "others",
				"count" : 0,
				"types" : []
			},
		};
		for(let key of Object.keys(genres)){
			let flag = false;
			if(key.includes("pop")){
				flag = true;
				genres_categorized["pop"].count += genres[key];
				genres_categorized["pop"].types.push(key);
			}
			if(key.includes("rock") || key.includes("punk")){
				flag = true;
				genres_categorized["rock"].count += genres[key];
				genres_categorized["rock"].types.push(key);
			}
			if(key.includes("metal") || key.includes("grunge")){
				flag = true;
				genres_categorized["metal"].count += genres[key];
				genres_categorized["metal"].types.push(key);
			}
			if(key.includes("hip hop") || key.includes("rap") || key.includes("g funk")){
				flag = true;
				genres_categorized["hip hop"].count += genres[key];
				genres_categorized["hip hop"].types.push(key);
			}
			if(key.includes("edm") || key.includes("electro") || key.includes("dance") || key.includes("house") || key.includes("room")){
				flag = true;
				genres_categorized["edm"].count += genres[key];
				genres_categorized["edm"].types.push(key);
			}
			if(key.includes("folk") || key.includes("sufi")){
				flag = true;
				genres_categorized["folk"].count += genres[key];
				genres_categorized["folk"].types.push(key);
			}
			if(key.includes("jazz") || key.includes("blues") || key.includes("r&b")){
				flag = true;
				genres_categorized["jazz"].count += genres[key];
				genres_categorized["jazz"].types.push(key);
			}
			if(key.includes("bollywood") || key.includes("filmi")){
				flag = true;
				genres_categorized["bollywood"].count += genres[key];
				genres_categorized["bollywood"].types.push(key);
			}
			if(key.includes("reggae")){
				flag = true;
				genres_categorized["reggae"].count += genres[key];
				genres_categorized["reggae"].types.push(key);
			}
			if(key.includes("indie") || key.includes("soul")){
				flag = true;
				genres_categorized["indie"].count += genres[key];
				genres_categorized["indie"].types.push(key);
			}
			if(!flag){
				genres_categorized["others"].count += genres[key];
				genres_categorized["others"].types.push(key);
			}
		}

		
		return genres_categorized;
	} catch (err) {
		console.log(err);
	}
}
