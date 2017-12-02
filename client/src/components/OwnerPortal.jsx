import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import OwnerFloorPlan from './OwnerFloorPlan';
import OwnerReservationView from './OwnerReservationView';


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
      name: 'Matcha Chai Oh My',
      image_url: 'http://matchasource.com/wp-content/uploads/2015/11/matcha_chai_small.jpg',
      address1: '1170 4th Street',
      display_phone: '777-777-7777',
    };
  }

  toggleEditMode = () => {
    this.setState({
      editFloorPlan: !this.state.editFloorPlan,
    });
  }

  render() {
    const { editFloorPlan, name, image_url, address1, display_phone } = this.state;
    const { classes } = this.props;
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
          ? <OwnerFloorPlan toggleEditMode={this.toggleEditMode} />
          : <OwnerReservationView />
        }
      </div>
    );
  }
}

export default withStyles(styles)(OwnerPortal);
