import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { generateMatrix, generateTables } from '../clientHelpers/ownerHelpers';


const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 3,
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
    '&:hover': {
      background: '#e7c9d5',
      border: '1px solid #e7c9d5',
    },
  },
  selectedSquare: {
    border: '1px solid #AD1457',
    boxSizing: 'border-box',
    background: '#AD1457',
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


class OwnerFloorPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numRows: 10,
      numCols: 10,
      matrix: props.matrix,
      tables: [],
    };
  }

  // componentDidMount = () => {
  //   const newMatrix = generateMatrix(10, 10);
  //   this.setState({
  //     matrix: newMatrix,
  //   });
  // }


  squares() {
    const { numRows, numCols, matrix } = this.state;
    const { classes } = this.props;

    if (matrix.length === 0) {
      return null;
    }

    const squaresArr = [];

    for (let row = 0; row < numRows; row += 1) {
      for (let col = 0; col < numCols; col += 1) {
        squaresArr.push(
          <div
            className={(matrix[row][col]) ? classes.selectedSquare : classes.square}
            key={[row, col]}
            value={matrix[row][col]}
            onClick={() => this.onSquareClick([row, col])}
          />
        );
      }
    }
    return squaresArr;
  }


  onSquareClick = (coordinates) => {
    const [row, col] = coordinates;
    const newMatrix = [...this.state.matrix];
    newMatrix[row][col] = !newMatrix[row][col];
    this.setState({
      matrix: newMatrix,
    });
  }

  render() {
    const { classes } = this.props; 
    return (
      <div className={classes.root}>
        <Paper className={classes.paper} >
          <Grid container spacing={24}>
            <Grid item xs={12} >
            <Typography type="headline" gutterBottom>
              Edit Floor Plan
            </Typography>
            </Grid>
            <Grid item xs>
              <Grid container spacing={16} >
                <Grid item xs={3} >
                  <div className={classes.exampleSquare} />
                </Grid>
                <Grid item xs={9} >
                  <Typography type="body1" gutterBottom align="left">
                    Each square is equal to 2 seats
                  </Typography>
                </Grid>
                <Grid item xs={3} >
                  <div className={classes.exampleSquare} />
                  <div className={classes.exampleSquare} />
                </Grid>
                <Grid item xs={9} >
                  <Typography type="body1" gutterBottom align="left">
                    Create bigger tables by putting squares next to each other
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <div className={classes.grid} >
              { this.squares() }
              </div>
              <Button
                type="null"
                raised
                color="accent"
                className={classes.button}
                onClick={e => this.props.onSaveClick(e, this.state.matrix)}
              >
                Save
              </Button>
          </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}


export default withStyles(styles)(OwnerFloorPlan);

// FilterForm.propTypes = {
//   times: PropTypes.arrayOf(PropTypes.string).isRequired,
//   categories: PropTypes.arrayOf(PropTypes.string).isRequired,
//   onFilterSubmitClick: PropTypes.func.isRequired,
//   classes: PropTypes.object.isRequired,
// };
