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
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  blueHeadline: {
    color: theme.palette.secondary['A700'],
    fontWeight: 300,
    marginLeft: theme.spacing.unit,
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
      showFormTip: false,
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

    if (city === '' || state === '') {
      e.preventDefault();
      this.setState({
        showFormTip: true,
      });
    } else {
      this.setState({
        showFormTip: false,
      });
      e.preventDefault();
      this.props.onSearchSubmitClick(`${city}, ${state}`, partyFilter);
    }
  }


  render() {
    const { city, state, partyFilter, showFormTip } = this.state;
    const { classes } = this.props;


    return (
      <div>
        <h3 className={classes.blueHeadline} >Make restaurant reservations the easier way</h3>
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

          <Button
            type={(showFormTip) ? "null": "submit"}
            raised
            color="accent"
            className={classes.button}
          >
            Find a Table
          </Button>
        </form>
        {(showFormTip) 
          ? (<Typography type="caption" gutterBottom align="left" color="primary">
            Enter a city and state
          </Typography>)
          : null }
      </div>
    );
  }
}


export default withStyles(styles)(SearchForm);

SearchForm.propTypes = {
  onSearchSubmitClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
