import React from 'react';
import PropTypes from 'prop-types';
import RestaurantEntry from './RestaurantEntry.jsx';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    height: '100%',
  },
  paper: {
    marginTop: 16,
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
  },
});


const AvailableReservations = (props) => {

  const { restaurantData, time, party, onAcceptClick, classes } = props;

  return (
      <Paper className={classes.paper}>
        <Grid 
          className={classes.root}
          container 
          spacing={24}
          alignItems="stretch"
          direction="row"
          justify="space-between"
        >

          <div>RESTAURANTS: {restaurantData.length}</div>
          {restaurantData.map(restaurant =>
            (<RestaurantEntry
              key={restaurant.name}
              restaurant={restaurant}
              time={time}
              party={party}
              onAcceptClick={onAcceptClick}
            />))}
        </Grid>
      </Paper>
  );
}

export default withStyles(styles)(AvailableReservations);

AvailableReservations.propTypes = {
  time: PropTypes.string.isRequired,
  party: PropTypes.string.isRequired,
  restaurantData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  onAcceptClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
