import React from 'react';
import PropTypes from 'prop-types';
import MyReservation from './Myreservation.jsx';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  paper: {
    padding: 16,
    color: theme.palette.text.primary,
  },
  resPaper: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // marginBottom: theme.spacing.unit * 2,
    height: '100%',
    width: 600,
    color: theme.palette.text.primary,
  },
  entry: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 1.5,
  },
});

const MyReservations = (props) => {
  const { classes } = props;

  return (
    <Paper className={classes.paper}>
      {(props.reservations.length === 0) ?
            <div>No Reservations</div> : props.reservations.map((reservation, idx) =>
        (<Grid
          container
          spacing={100}
          alignItems="stretch"
          direction="row"
          justify="space-between"
        >
        <div className={classes.entry}>
        <Paper className={classes.resPaper}>
          <MyReservation
            reservation={reservation}
            key={reservation.id}
            index={idx}
            cancel={props.onCancelClick}
            href="/home"
          />
          </Paper>
          </div>
         </Grid>
        ))}
    </Paper>
  );
};


export default withStyles(styles)(MyReservations);

// MyReservations.propTypes = {
//   onCancelClick: PropTypes.func.isRequired,
//   reservations: PropTypes.arrayOf(PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     restaurant: PropTypes.string.isRequired,
//     time: PropTypes.string.isRequired,
//     party: PropTypes.number.isRequired,
//   })).isRequired,
// };
