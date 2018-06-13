const clientID = 'e796ff2199f04e9cb68e371cd45b237c';
const redirectURI = 'http://kupe-jammming.surge.sh/';
const searchBase = 'https://api.spotify.com/v1/';
const accessBase = 'https://accounts.spotify.com/authorize';

let accessToken;

const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }
    const URLToken = window.location.href.match(/access_token=([^&]*)/);
    const tokenExpiration = window.location.href.match(/expires_in=([^&]*)/);
    if (URLToken && tokenExpiration) {
      accessToken = URLToken[1];
      const expires = Number(tokenExpiration[1]);
      window.setTimeout(()=> accessToken = '', expires * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessURL = `${accessBase}?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessURL;
    }
  },
  search(term) {
    let accessToken = Spotify.getAccessToken();
    return fetch(`${searchBase}search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
        if(!jsonResponse.tracks){
        return [];
      }
      return jsonResponse.tracks.items.map( track => ({
        id: track.id,
        name : track.name,
        artist: track.artists[0].name, // first artist if array returned
        album: track.album.name,
        uri: track.uri
      }))
    })
  },
  savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris) return;
    const searchURL = searchBase + 'me';
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    let userID;
    let playlistID;
    fetch(searchURL, {
      headers: headers
    })
    .then(response => response.json())
    .then(jsonResponse => userID = jsonResponse.id)
    .then(() => {
      const createPlaylistUrl = `${searchBase}users/${userID}/playlists`;
      fetch(createPlaylistUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            name: playlistName
          })
        })
        .then(response => response.json())
        .then(jsonResponse => playlistID = jsonResponse.id)
        .then(() => {
          const addPlaylistTracksUrl = `${searchBase}users/${userID}/playlists/${playlistID}/tracks`;
          fetch(addPlaylistTracksUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              uris: trackUris
            })
          });
        })
    })
  }
};

export default Spotify;
