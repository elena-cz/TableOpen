import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';


const styles = theme => ({
  pinkTitle: {
    color: theme.palette.primary[500],
  },
  button: {
    borderRadius: 5,
    width: 60,
    margin: 5,
    display: 'inline-block'
  },
});

const ReservationEntry = props => {
  const { reservationTime, restaurant, accept, classes } = props;
  console.log(reservationTime);

  return (
    <div key={reservationTime}>
      <Button 
        raised
        color="primary"
        className={classes.button}
        onClick={() => accept(reservationTime, restaurant)}
      >
        {reservationTime}
      </Button>
    </div>);
}

export default withStyles(styles)(ReservationEntry);

ReservationEntry.propTypes = {
  accept: PropTypes.func.isRequired,
  restaurant: PropTypes.string.isRequired,
  reservationTime: PropTypes.string.isRequired,
};
