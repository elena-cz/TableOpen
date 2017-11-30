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

  const { restaurantInfo, time, party, onAcceptClick, classes } = props;

  const restaurant = restaurantInfo[0];
  console.log('restaurantInfo[1]', restaurantInfo[1]);
  const reservationTimesForParty = restaurantInfo[1].map(reservation => (reservation[1] === party) ? reservation[0]: null);
  console.log('reservationTimesForParty', reservationTimesForParty);k
  // if (restaurant[1].length ) {
  //   return null;
  // }

  return (
    <Grid item xs={12} >
      <Grid container>
        <Grid item xs={3}>
          <img width="90%" src={restaurant.image_url} alt="pic of restaurant" />
        </Grid>
        <Grid item xs={9}>
        <Typography type="title" gutterBottom className="classes.pinkTitle">{restaurant.name}</Typography>
        {reservationTimesForParty.map(time =>
          (
             <ReservationEntry
              key={time}
              restaurant={restaurant.name}
              reservationTime={time}
              accept={onAcceptClick}
            />
        ))}
        </Grid>
      </Grid>
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
