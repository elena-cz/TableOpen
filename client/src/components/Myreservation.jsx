import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = theme => ({
  restaurantInfo: {
    overflow: 'hidden',
    float: 'left',
    paddingLeft: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 2,
  },
  image: {
    width: 200,
    height: 150,
    overflow: 'hidden',
    float: 'left',
    paddingLeft: 6,
    paddingTop: 5,
    paddingBottom: 10,
  },
  button: {
    borderRadius: 3,
    width: 5,
    height: 5,
    marginLeft: 275,
    marginBottom: 5,
  },
});

const MyReservation = (props) => {
  const { classes } = props;
  return (
    <div>
      <Grid item xs={4} >
        <img src={props.reservation.restaurant.image} alt="pic of restaurant" className={classes.image} />
      </Grid>
      <Grid item xs={8} className={classes.restaurantInfo}>
        <Typography type="title" gutterBottom><a href={props.reservation.restaurant.url} target="_blank" >{props.reservation.restaurant.name}</a></Typography>
        <Typography type="body1">
              Time: {props.reservation.time}pm
          <br />
              Party: {props.reservation.party_size}
          <br />
          {props.reservation.restaurant.address}
          <br />
          {props.reservation.restaurant.phone}
        </Typography>
        <Button
          className={classes.button}
          onClick={() => props.cancel(props.reservation.id)}
          type="submit"
          color="primary"
          hoverColor="accent"
          href="/home"
          raised
        >
        Cancel
        </Button>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(MyReservation);

// MyReservation.propTypes = {
//   index: PropTypes.number.isRequired,
//   cancel: PropTypes.func.isRequired,
//   reservation: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     restaurant: PropTypes.string.isRequired,
//     time: PropTypes.string.isRequired,
//     party: PropTypes.number.isRequired,
//   }).isRequired,
// };
