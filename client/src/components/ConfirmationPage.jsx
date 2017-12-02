import React from 'react';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  paper: {
    padding: 16,
    color: theme.palette.text.primary,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit,
  },
  blackHeadline: {
    fontWeight: 500,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit,
    width: 275,
    height: 75,
  },
  accomodations: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
  },
  smallerField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    width: 100,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
  },
});

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    console.log(this.state.input);
  }

  handleChange(e) {
    this.setState({
      input: e.target.value,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
      <div>
        <div className="confirmation" />
        <h3 className={classes.blackHeadline}> Please confirm your reservation for December 1st at { this.props.reservation.time } at { this.props.restaurant } for { this.props.reservation.party_size } </h3>
        <form onSubmit={this.handleSubmit} className={classes.container}>
          <label>
          <div className={classes.accomodations} >Enter any special accomodations here:</div>
            <textarea value={this.state.input} onChange={this.handleChange} className={classes.textField}/>
          <div className={classes.button}>
          <Button
            type="submit"
            raised
            color="accent"
          >
            Confirm
          </Button>
          </div>
          </label>
        </form>
      </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(Confirmation);