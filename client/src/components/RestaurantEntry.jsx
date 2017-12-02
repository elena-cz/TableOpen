import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import ReservationEntry from './ReservationEntry';

// Conditionally render an individual reservation only if it's:
//   1) not already booked by a customer
//   2) meets the criteria of the various filters for time/size/category

const styles = theme => ({
  // pinkTitle: {
  //   color: theme.palette.primary[500],
  //   textAlign: 'left',
  // },
  restaurantInfo: {
    textAlign: 'left',
    justifySelf: 'start',
  },
  image: {
    width: 200,
    height: 150,
    overflow: 'hidden',
  },
});


const RestaurantEntry = (props) => {

  const { restaurantInfo, time, party, onAcceptClick, classes } = props;

  const restaurant = restaurantInfo;
  const reservationTimesForParty = restaurantInfo.reservations;
  reservationTimesForParty.sort((a, b) => {
    var x = a.time.replace(/[^a-zA-Z0-9-_]/g, '');
    var y = b.time.replace(/[^a-zA-Z0-9-_]/g, '');
    return x - y;
  });
  if (reservationTimesForParty.length > 0) {
    return (
      <Grid item xs={12} >
        <Grid container>
          <Grid item xs={4} >
            <img src={restaurant.image} alt="pic of restaurant" className={classes.image} />
          </Grid>
          <Grid item xs={8} className={classes.restaurantInfo}>
            <Typography type="title" gutterBottom><a href={restaurant.url} target="_blank" >{restaurant.name}</a></Typography>
            <Typography type="body1">
              {restaurant.address}
              <br />
              {restaurant.phone}
            </Typography>

            {reservationTimesForParty.map(resTime =>
              (
                <ReservationEntry
                  key={resTime.time}
                  restaurant={restaurant.name}
                  reservationTime={resTime.time}
                  accept={onAcceptClick}
                  reservation={resTime}
                />
            ))}
          </Grid>
        </Grid>
      </Grid>
    );
  }
  return null;
};

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
