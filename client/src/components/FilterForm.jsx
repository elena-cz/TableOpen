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
  blueSmallHeading: {
    color: theme.palette.secondary['A700'],
    display: 'block',
    marginLeft: theme.spacing.unit,
  },
});

class FilterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeFilter: 'All',
      restaurant: '',
      categoryFilter: 'All',
    };

    this.onStateChange = this.onStateChange.bind(this);
  }

  onStateChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onFormSubmit(e) {
    const { timeFilter, restaurant, categoryFilter } = this.state;
    e.preventDefault();
    this.props.onFilterSubmitClick(timeFilter, restaurant, categoryFilter );
  }

  render() {

    const { timeFilter, restaurant, categoryFilter } = this.state;
    const { times, categories, classes } = this.props;

    return (
      <div>
        <Typography className={classes.blueSmallHeading} type="body2" >
          Filter
        </Typography>
        <form
          className={classes.container}
          onSubmit={e => this.onFormSubmit(e)}
        >
          <TextField
            id="timeFilter"
            name="timeFilter"
            select
            label="Time"
            className={classes.smallerField}
            value={timeFilter}
            onChange={this.onStateChange}
            SelectProps={{
              native: true,
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal"
          >
            {times.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>

          <TextField
            className={classes.textField}
            id="restaurant"
            name="restaurant"
            label="Restaurant Name"
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
            value={restaurant}
            onChange={this.onStateChange}
          />

          <TextField
            id="categoryFilter"
            name="categoryFilter"
            select
            label="Category"
            className={classes.smallerField}
            value={categoryFilter}
            onChange={this.onStateChange}
            SelectProps={{
              native: true,
              MenuProps: {
                className: classes.menu,
              },
            }}
            margin="normal"
          >
            {categories.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>

          <Button
            type="submit"
            color="accent"
            className={classes.button}
          >
            Save
          </Button>
        </form>
      </div>
    );
  }
}


export default withStyles(styles)(FilterForm);

FilterForm.propTypes = {
  times: PropTypes.arrayOf(PropTypes.string).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterSubmitClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
