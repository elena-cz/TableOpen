import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';


const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 16,
  },
  paper: {
    marginTop: 30,
    padding: 16,
    color: theme.palette.text.primary,
  },
});


class OwnerReservationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return null;
  }
}

export default withStyles(styles)(OwnerReservationView);
