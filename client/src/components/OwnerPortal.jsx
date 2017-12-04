import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import OwnerFloorPlan from './OwnerFloorPlan';
import OwnerReservationView from './OwnerReservationView';
import { generateMatrix, generateTables, getMatrixFromCoordinates } from '../clientHelpers/ownerHelpers';


const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 3,
  },
  paper: {
    marginTop: 30,
    padding: 16,
    color: theme.palette.text.primary,
  },
  restaurantInfo: {
    textAlign: 'left',
    justifySelf: 'start',
  },
  image: {
    width: 250,
    height: 150,
    overflow: 'hidden',
  },
});


class OwnerPortal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editFloorPlan: false,
      restaurantId: null,
      name: 'Matcha Chai Oh My',
      image_url: 'http://matchasource.com/wp-content/uploads/2015/11/matcha_chai_small.jpg',
      address1: '1170 4th Street',
      display_phone: '777-777-7777',
      matrix: [],
      reservationMatrix: [],
      reservations: [],
      selectedTime: '5:00pm',
    };
  }

  componentDidMount = () => {
    const { name, image_url, address1, display_phone } = this.state;
    axios.get(`/restaurant/${name}`)
      .then((result) => {
        if (result.data) {
          console.log('result.data.floorplan', result.data.floorplan);
          this.setState({
            restaurantId: result.data.id,
            // matrix: result.data.floorplan,
            matrix: JSON.parse(result.data.floorplan),

          });
          console.log('in componentDidMount');
            axios.get(`/restaurants/${this.state.restaurantId}/reservations`)
              .then((data) => {
                console.log('data.reservations', data.data.reservation);
                this.setState({
                  reservations: data.data.reservation,
                });
                this.getMatrixForTime(data.data.reservation, '5:00pm', 10, 10);
              });
        } else {
          const newMatrix = generateMatrix(10, 10);
          this.setState({
            matrix: newMatrix,
          });

          axios.post('/restaurants', {
            name,
            category: 'Elena Food',
            address: address1,
            city: 'Berkeley',
            state: 'CA',
            zip: '94703',
            phone: display_phone,
            url: null,
            image: image_url,
            review_count: 406,
            rating: 5.0,
            floorplan: JSON.stringify(newMatrix),
          });
        }
      });
  }

  getMatrixForTime = (reservations, time) => {
    const newMatrix = getMatrixFromCoordinates(reservations, time, 10, 10);
    this.setState({
      reservationMatrix: newMatrix,
    });
  }

  onTimeClick = (time) => {
    console.log(time);
    this.setState({
      selectedTime: time,
    });
    this.getMatrixForTime(this.state.reservations, time);
  }

  toggleEditMode = () => {
    this.setState({
      editFloorPlan: !this.state.editFloorPlan,
    });
  }

  onSaveClick = (e, matrix) => {
    e.preventDefault();
    axios.post(`/restaurants/${this.state.restaurantId}/reservations`, {
      floorplan: JSON.stringify(matrix),
    })
      .then((results) => {
        console.log(results);
        this.toggleEditMode();
        axios.get(`/restaurants/${this.state.restaurantId}/reservations`)
          .then((data) => {
            this.setState({
              reservations: data.reservation,
            });
            this.getMatrixForTime(data.reservation, '5:00pm', 10, 10);
          });
      });
  }
 

  render() {
    const { editFloorPlan, name, image_url, address1, display_phone, matrix } = this.state;
    const { times, classes } = this.props;
    return (
      <div className={classes.root} >
        <Paper className={classes.paper} >
        <Grid container>
          <Grid item xs={4} >
            <img src={image_url} alt="pic of restaurant" className={classes.image} />
          </Grid>
          <Grid item xs={5} className={classes.restaurantInfo}>
            <Typography type="title" gutterBottom>{name}</Typography>
            <Typography type="body1">
              {address1}
              <br />
              {display_phone}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {(editFloorPlan) ? null :
              <Button
                type="null"
                raised
                color="primary"
                onClick={this.toggleEditMode}
              >
                Edit Floor Plan
              </Button>
            }
          </Grid>
        </Grid>
        </Paper>
          {(editFloorPlan)
            ? <OwnerFloorPlan
              toggleEditMode={this.toggleEditMode}
              onSaveClick={this.onSaveClick}
              matrix={matrix}
             />
            : <OwnerReservationView
              onTimeClick={this.onTimeClick}
              matrix={this.state.reservationMatrix}
              times={times} />
          }
      </div>
    );
  }
}

export default withStyles(styles)(OwnerPortal);
