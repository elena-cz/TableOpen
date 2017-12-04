import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    margin: 0,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 1,
    width: '100%',
  },
  title: {
    flex: 1,
    color: 'white',
    fontFamily: 'Roboto Slab, serif',
  },
});

class TopMenu extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        currUserName: '',
        currUserProfile: '',
      };
  };

  componentWillMount() {
    axios.get('/facebookData')
      .then((results) => {
        this.setState({
          currUserName: results.data.currUserName,
          currUserProfile: results.data.currUserProfile,
        })
      })
      .catch((err) => {
        console.log('Error getting results', err);
      });
  };

// Welcome {this.state.currUserName} ! 
            // <img src={this.state.currUserProfile} /> 
  render(){
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.title}>
              TableOpen
            </Typography>
            { (this.state.currUserName.length > 0) ? 
            ( 
            <div>
            <Button color="contrast">My Reservations</Button>
            <Button color="contrast" href="/logout">Logout</Button>
            </div>
            ) : (
            <div>
            <Button a href="/" color="contrast"> Login </Button>
            </div>
            )
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

TopMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopMenu);
