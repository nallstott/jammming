import React, { Component } from 'react';
import Spotify from '../../util/Spotify';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import './App.css';

class App extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		searchResults: [],
			playlistTracks: [],
			playlistName: 'New Playlist'
  	};

		this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  removeTrack(track){
    const trackIndex = this.state.playlistTracks.findIndex(savedTrack => savedTrack.id === track.id);
    const playlistTracks = this.state.playlistTracks;
    playlistTracks.splice(trackIndex, 1);
    this.setState({
		   playlistTracks: playlistTracks
		});
  }

	addTrack(track){
		if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){
			return;
		}
		this.setState({
		   playlistTracks: [...this.state.playlistTracks, track]
		});
	}

  updatePlaylistName(name){
    this.setState({
       playlistName: name
    });
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
    const playlistName = this.state.playlistName;
    Spotify.savePlaylist(playlistName, trackURIs);
    this.setState({
       playlistName: 'New Playlist',
       playlistTracks: []
    });
  }

  search(term){
    Spotify.search(term).then(tracks => {
      this.setState({
         searchResults: tracks
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
