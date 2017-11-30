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
  },
});

const ReservationEntry = props => {
  const { reservation, restaurant, accept, classes } = props;

  return (
    <div key={reservation.time}>
      <Button 
        raised
        color="primary"
        className={classes.button}
        onClick={() => accept(reservation, restaurant)}
      >
        {moment(reservation.time).format('LT')}
      </Button>
    </div>);
}

export default withStyles(styles)(ReservationEntry);

ReservationEntry.propTypes = {
  accept: PropTypes.func.isRequired,
  restaurant: PropTypes.string.isRequired,
  reservation: PropTypes.shape({
    time: PropTypes.string,
    people: PropTypes.number,
  }).isRequired,
};
