import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import OwnerFloorPlan from './OwnerFloorPlan';


const styles = theme => ({
  paper: {
    marginTop: 30,
    padding: 16,
    color: theme.palette.text.primary,
  },
});


class OwnerPortal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper} >
        <OwnerFloorPlan />
      </Paper>
    );
  }
}

export default withStyles(styles)(OwnerPortal);
