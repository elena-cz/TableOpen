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

  if (restaurantData.length > 0) {
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
          {restaurantData.map(restaurant =>
            (<RestaurantEntry
              key={restaurant[0].name}
              restaurantInfo={restaurant}
              time={time}
              party={party}
              onAcceptClick={onAcceptClick}
            />)) }
        </Grid>
      </Paper>
    );
  }

  return null;
};

export default withStyles(styles)(AvailableReservations);

AvailableReservations.propTypes = {
  time: PropTypes.string.isRequired,
  party: PropTypes.number.isRequired,
  restaurantData: PropTypes.array.isRequired,
  onAcceptClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
