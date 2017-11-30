import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import PhoneNumber from './PhoneNumber';
import SearchForm from './SearchForm';
import FilterForm from './FilterForm';


const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
  paper: {
    padding: 16,
    color: theme.palette.text.primary,
  },
});


const Search = (props) => {
  const {
    onSearchSubmitClick,
    times,
    categories,
    onFilterSubmitClick,
    onPhoneNumberSubmitClick,
    phoneNumber,
    onStateChange,
    classes,
  } = props;

  return (
      <Paper className={classes.paper}>
        <Grid
          className={classes.root}
          container
          spacing={24}
          alignItems="flex-end"
          direction="row"
          justify="center"
        >
          <Grid item xs={7}>
            <SearchForm
              onSearchSubmitClick={onSearchSubmitClick}
            />
            <br />
            <FilterForm
              times={times}
              categories={categories}
              onFilterSubmitClick={onFilterSubmitClick}
            />
          </Grid>
          <Grid item xs={4}>
            <PhoneNumber
              onPhoneNumberSubmitClick={onPhoneNumberSubmitClick}
              phoneNumber={phoneNumber}
              onStateChange={onStateChange}
            />
          </Grid>
        </Grid>
      </Paper>
  );
};

export default withStyles(styles)(Search);

Search.propTypes = {
  phoneNumber: PropTypes.string.isRequired,
  times: PropTypes.arrayOf(PropTypes.string).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPhoneNumberSubmitClick: PropTypes.func.isRequired,
  onSearchSubmitClick: PropTypes.func.isRequired,
  onFilterSubmitClick: PropTypes.func.isRequired,
  onStateChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
