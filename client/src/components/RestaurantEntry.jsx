import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import ReservationEntry from './ReservationEntry.jsx';

// Conditionally render an individual reservation only if it's:
//   1) not already booked by a customer
//   2) meets the criteria of the various filters for time/size/category

const styles = theme => ({
  pinkTitle: {
    color: theme.palette.primary[500],
  },
});

// const showReservationEntry = (props) => {
//    const { restaurant, time, party, onAcceptClick, classes } = props;
//     if (restaurant.reservations.length ===)



// }


const RestaurantEntry = (props) => {

  const { restaurant, time, party, onAcceptClick, classes } = props;

  return (
    <Grid item xs={4} >
      <div>
        <Typography type="title" gutterBottom className="classes.pinkTitle">{restaurant.name}</Typography>
        <img width="90%" src={restaurant.image_url} alt="pic of restaurant" />
        {restaurant.reservations.map(reservation =>
          (
            <div key={reservation.id}>{
            (moment(reservation.time).format('LT') === time || time === 'All')
            && (reservation.people.toString() === party || party === 'All')
            && (!reservation.booked)
            && <ReservationEntry
              key={reservation.time}
              restaurant={restaurant.name}
              reservation={reservation}
              accept={onAcceptClick}
            />
            }
            </div>))}
      </div>
    </Grid>
    );
}

export default withStyles(styles)(RestaurantEntry);

// RestaurantEntry.propTypes = {
//   restaurant: PropTypes.shape({
//     name: PropTypes.string,
//     image_url: PropTypes.string,
//     reservations: PropTypes.arrayOf(PropTypes.shape({
//       time: PropTypes.string,
//       people: PropTypes.number,
//     })).isRequired,
//   }).isRequired,
//   time: PropTypes.string.isRequired,
//   party: PropTypes.string.isRequired,
//   onAcceptClick: PropTypes.func.isRequired,
// };
