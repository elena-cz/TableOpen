import React from 'react';
import PropTypes from 'prop-types';
import MyReservation from './Myreservation';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 16,
  },
  paper: {
    marginTop: 30,
    padding: 16,
    color: theme.palette.text.primary,
  },
});


const MyReservations = props => (
  <Paper className={props.classes.paper}>
    <Grid
      className={props.classes.root}
      container
      spacing={24}
    >
      <div className="myReservations">
      <h3>My Reservations</h3>
        {(props.reservations.length === 0) ?
          <div>No Reservations</div> : props.reservations.map((reservation, idx) =>
            (
              <MyReservation
                reservation={reservation}
                key={reservation.id}
                index={idx}
                cancel={props.onCancelClick}
              />
            ))}
      </div>
    </Grid>
  </Paper>
);

export default withStyles(styles)(MyReservations);

MyReservations.propTypes = {
  onCancelClick: PropTypes.func.isRequired,
  reservations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    restaurant: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    party: PropTypes.number.isRequired,
  })).isRequired,
};
