import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';


const styles = theme => ({
  grid: {
    flexGrow: 1,
    padding: 16,
    background: 'yellow',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    gridTemplateTows: '1fr 1fr 1fr 1fr 1fr',
    gridColumnGap: 0,
    gridRowGap: 0,
    border: '2px solid #eeeeee',
    width: 500,
    height: 500,
    },
  paper: {
    marginTop: 30,
    padding: 16,
    color: theme.palette.text.primary,
  },
});



class OwnerFloorPlan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    return (
      <Paper className={this.props.classes.paper} >
        <div className={this.props.classes.grid} >

        </div>

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