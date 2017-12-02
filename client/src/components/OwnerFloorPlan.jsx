import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { generateTables } from '../clientHelpers/ownerHelpers';


const styles = theme => ({
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
      background: 'rgba(173, 20, 87, 0.25)',
    },
  },
  selectedSquare: {
    border: '1px solid #AD1457',
    boxSizing: 'border-box',
    background: '#AD1457',
  },
});


class OwnerFloorPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numRows: 10,
      numCols: 10,
      matrix: [],
      tables: [],
    };
  }

  componentDidMount = () => {
    const newMatrix = this.createMatrix();
    this.setState({
      matrix: newMatrix,
    });
  }


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
    newMatrix[row][col] = (newMatrix[row][col]) ? 0 : 1;
    this.setState({
      matrix: newMatrix,
    });
  }

  onSaveClick = (e) => {
    e.preventDefault();
    const tables = generateTables(this.state.matrix);
    this.setState({
      tables,
    });
  }

  createMatrix = () => {
    const { numRows, numCols } = this.state;
    const row = Array(numCols).fill(0);
    const matrix = row.map(() => [...row]);
    return matrix;
  }

  render() {
    return (
      <Paper className={this.props.classes.paper} >
        <div className={this.props.classes.grid} >
        { this.squares() }
        </div>
        <Button type="null" raised color="accent" onClick={e => this.onSaveClick(e)} >
          Save
        </Button>
      </Paper>
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