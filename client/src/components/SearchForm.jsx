import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    width: 200,
  },
  menu: {
    width: 200,
  },
  smallerField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    width: 80,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      state: '',
      partyFilter: 'All',
    };

    this.onStateChange = this.onStateChange.bind(this);
  }

  onStateChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onFormSubmit(e) {
    const { city, state, partyFilter } = this.state;
    e.preventDefault();
    this.props.onSearchSubmitClick(`${city}, ${state}`, partyFilter);
  }


  render() {
    const { city, state, partyFilter } = this.state;
    const { classes } = this.props;

    const renderButton = () => {
      if (city && state.length === 2) {
        return (
          <Button
            type="submit"
            raised
            color="accent"
            className={classes.button}
          >
            Find a Table
          </Button>
        );
      }
      return (
        <Button
          type="submit"
          raised
          disabled
          className={classes.button}
        >
          Find a Table
        </Button>
      );
    };


    return (
      <div>
        <form
          className={classes.container}
          onSubmit={e => this.onFormSubmit(e)}
        >
          <TextField
            className={classes.textField}
            id="city"
            name="city"
            label="City"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="San Francisco"
            margin="normal"
            value={city}
            onChange={this.onStateChange}
          />
          <TextField
            className={classes.smallerField}
            id="state"
            name="state"
            label="State"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="CA"
            margin="normal"
            value={state}
            onChange={this.onStateChange}
          />

          <TextField
            id="partyFilter"
            select
            label="Party Size"
            className={classes.smallerField}
            value={partyFilter}
            onChange={this.onStateChange}
            SelectProps={{
              native: true,
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal"
          >
            {[2, 4, 6, 8].map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>

          {renderButton()}
        </form>
      </div>
    );
  }
}


export default withStyles(styles)(SearchForm);

SearchForm.propTypes = {
  onSearchSubmitClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
