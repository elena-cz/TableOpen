import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { getMatrixFromCoordinates } from '../clientHelpers/ownerHelpers';


const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 3,
    flexGrow: 1,
  },
  paper: {
    marginTop: 30,
    padding: 16,
    color: theme.palette.text.primary,
  },
  grid: {
    flexGrow: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 1fr)',
    gridTemplateTows: 'repeat(10, 1fr)',
    gridColumnGap: 0,
    gridRowGap: 0,
    border: '1px solid #eeeeee',
    width: 500,
    height: 500,
  },
  square: {
    border: '1px solid #eeeeee',
    boxSizing: 'border-box',
  },
  bookedSquare: {
    border: '1px solid #AD1457',
    boxSizing: 'border-box',
    background: '#AD1457',
  },
  unbookedSquare: {
    border: '1px solid #e7c9d5',
    boxSizing: 'border-box',
    background: '#e7c9d5',
  },
  button: {
    margin: 10,
    float: 'right',
  },
  exampleSquare: {
    background: '#AD1457',
    height: 50,
    width: 50,
  },
});


class OwnerReservationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numRows: 10,
      numCols: 10,
      // matrix: [],
      // tables: [],
      // selectedTime: '5:00pm',
    };
  }

  // componentDidMount = () => {
    // const tables = [
    //   {
    //     size: 2,
    //     coordinates: [[0, 3]],
    //     booked: true,
    //   },
    //   {
    //     size: 8,
    //     coordinates: [[1, 5], [1, 6], [1, 7], [2, 7]],
    //     booked: false,
    //   },
    //   {
    //     size: 4,
    //     coordinates: [[2, 1], [3, 1]],
    //     booked: true,
    //   },
    // ];
    // const newMatrix = getMatrixFromCoordinates(tables, 10, 10);
  //   this.setState({
  //     matrix: this.props.reservationMatrix,
  //   });
  // }

  // onClickTime = (e) => {
  //   this.setState({
  //     selectedTime: e.target.value,
  //   });
  // };


  getClassName = (value) => {
    const { classes } = this.props;
    if (value === 2) {
      return classes.bookedSquare;
    }
    if (value === 1) {
      return classes.unbookedSquare;
    }
    return classes.square;
  }


  squares = () => {
    const { numRows, numCols } = this.state;
    const { classes, matrix } = this.props;

    if (matrix.length === 0) {
      return null;
    }

    const squaresArr = [];

    for (let row = 0; row < numRows; row += 1) {
      for (let col = 0; col < numCols; col += 1) {
        squaresArr.push(
          <div
            className={this.getClassName(matrix[row][col])}
            key={[row, col]}
            value={matrix[row][col]}
          />
        );
      }
    }
    return squaresArr;
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper} >
          <Grid container spacing={24}>
            <Grid item xs={12} >
            <Typography type="headline" gutterBottom>
              Reservations
            </Typography>
            </Grid>
            <Grid item xs>
              <Grid container spacing={16} >
                <Grid item xs={12}>
                  <p>View reservations by time:</p>
                </Grid>
                {['5:00pm', '5:30pm', '6:00pm', '6:30pm', '7:00pm', '7:30pm', '8:00pm', '8:30pm', '9:00pm'].map(time => (
                  <Grid item xs={12}>
                    <Button 
                      color="accent"
                      type="null"
                      value={time}
                      onClick={() => this.props.onTimeClick(time)}
                    >
                      {time}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs>
              <div className={classes.grid} >
              { this.squares() }
              </div>
          </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(OwnerReservationView);
