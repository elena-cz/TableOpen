import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  blueSmallHeading: {
    marginLeft: theme.spacing.unit,
    color: theme.palette.secondary['A700'],
    display: 'block',
    marginBottom: 0,
  },
});

const PhoneNumber = (props) => {
  const { phoneNumber, onStateChange, onPhoneNumberSubmitClick, classes } = props;

  return (
    <div>
      <Typography className={classes.blueSmallHeading} type="body2" >
          Add your phone number to receive text confirmations
      </Typography>
      <div className={classes.container}>

        <TextField
          className={classes.textField}
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          placeholder="555-555-5555"
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          value={props.phoneNumber}
          onChange={e => onStateChange(e)}
        />

        <Button
          color="accent"
          className={classes.button}
          onClick={() => onPhoneNumberSubmitClick(phoneNumber)}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default withStyles(styles)(PhoneNumber);

PhoneNumber.propTypes = {
  onPhoneNumberSubmitClick: PropTypes.func.isRequired,
  onStateChange: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};
