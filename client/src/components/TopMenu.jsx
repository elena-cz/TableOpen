import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    margin: 0,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
  title: {
    flex: 1,
    color: 'white',
    fontFamily: 'Roboto Slab, serif',
  },
});

function TopMenu(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.title}>
            TableOpen
          </Typography>
          <Button color="contrast">My Reservations</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

TopMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopMenu);
