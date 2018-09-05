import React, { Component } from 'react';
import './PlaylistChooser.css';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import * as SpotifyFunctions from '../spotifyFunctions.js'
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

  const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
    },
    playlistViewer: {
      height: "200px",
      overflow: "auto",
      flex: "2 1 auto",
      backgroundColor: 'inherit',
    },
    optionsSelection: {
      flex: "1 1 auto",
      backgroundColor: 'inherit',
      padding: 0,
      display: "flex",
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
    },
  });


class PlaylistChooser extends Component {

  constructor(props){
    super(props)
    this.classes = props;
      this.state = {
      addRelatedDiscography: "false",
      playlists: [],
      chosenPlaylistIndex: 0,
      chosenPlaylistName: 'Choose a playlist',
      chosenPlaylistId: null,
      anchorElement: null
    }
  }

  changeAddRelatedDiscography(e){
    e.preventDefault()
    this.setState({addRelatedDiscography: e.target.value})
  }

  handlePlaylistChooserTopLevelClick(e) {
    console.log("e.currentTarget from handlePlaylistChooserTopLevelClick",e.currentTarget);
    console.log("e.target from handlePlaylistChooserTopLevelClick",e.target);
    this.setState({anchorElement: e.currentTarget})
  }

  handlePlaylistMenuClick(e, playlistIndex){
    this.setState({
      chosenPlaylistIndex: playlistIndex, 
      chosenPlaylistName: this.state.playlists[playlistIndex].playlistName, 
      chosenPlaylistId: this.state.playlists[playlistIndex].id, 
      anchorElement: null})
  }

  handlePlaylistMenuClose(e){
    this.setState({anchorElement: null})
  }

  async componentDidMount() {
    await SpotifyFunctions.setAccessToken(this.props.accessToken);
    const playlists = await SpotifyFunctions.getUserPlaylists();
    this.setState({playlists: playlists});
  }

  generateListItem(playlistObj) {
    return (
      <ListItem key={playlistObj.id}>
            <ListItemText primary={playlistObj.playlistName}/>
      </ListItem>
    )
  }

  generateMenuItem(playlistObj, index) {
    return (
      <MenuItem key={playlistObj.id} selected={index === this.state.chosenPlaylistIndex} onClick={(e) => {this.handlePlaylistMenuClick(e, index)}}>
            {playlistObj.playlistName}
      </MenuItem>
    )
  }

render() {
    return (
      <div className={`PlaylistChooser ${this.classes}`}>
        <List className={this.classes.playlistViewer}>
          <ListItem button onClick={(e) => this.handlePlaylistChooserTopLevelClick(e)}>
            <ListItemText primary="Choose a playlist to shuffle" secondary={this.state.chosenPlaylistName} />
          </ListItem>
        </List>
        <Menu 
          id="lock-menu" 
          anchorelement={this.state.anchorElement} 
          open={Boolean(this.state.anchorElement)} 
          onClose={(e) => this.handlePlaylistMenuClose(e)}
        >
          {this.state.playlists.map((playlistObj, index) => {return this.generateMenuItem(playlistObj, index)})}
        </Menu>
        <div className={this.classes.optionsSelection}>
        <FormControl component="fieldset" className={this.classes.optionsSelection}>
          <FormGroup>
          <FormLabel component="legend">Add Related Discography</FormLabel>
          <RadioGroup
            aria-label="Add Related Discography"
            name="addRelatedDiscography"
            value={this.state.addRelatedDiscography}
            onChange={(e) => this.changeAddRelatedDiscography(e)}
          >
            <FormControlLabel value="true" control={<Radio />} label="Include" />
            <FormControlLabel value="false" control={<Radio />} label="Just my Playlist" />
          </RadioGroup>
          </FormGroup>
        </FormControl>
        </div>
        <button className="playNowButton" onClick={(e) => {this.state.addRelatedDiscography === "false" ? SpotifyFunctions.byAlbumNoDiscography(this.state) : SpotifyFunctions.byAlbumWithDiscography(this.state)}}>Play Now</button>
        <p className="checkYourPlaylistsAlert">You have to have Spotify open to start playback. If Spotify can't find an active device it will create a new playlist you can access later</p>
      </div>
    )
  }
}

  
export default withStyles(styles)(PlaylistChooser);
