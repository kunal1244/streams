exports.dataQuery = `{
    me {
      	artists(limit : -1){
          id
          name
          images{
            url
          }
          genres
      	}
        albums{
          album{
            id
            name
            images{
              url
            }
            artists{
              id
              name
            }
          }
        } 
        tracks(limit : -1){
          track{
            album{
              id
              name
            }
            artists{
              id
              name
            }
          }
        }
        top_tracks(limit : -1){
          album{
            id
            name
          }
          artists{
            id
            name
          }
        }
        top_artists(limit : -1){
          id
          name
          genres
          images{
            url
          }
        }
        playlists(limit : -1){
            tracks(limit : -1){
                track{
                    album{
                        id
                        name
                    }
                    artists{
                      id
                      name
                    }
                }
            }
        }
    }
}`;