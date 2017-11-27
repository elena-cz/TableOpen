import React from 'react';
import PropTypes from 'prop-types';
import PhoneNumber from './PhoneNumber.jsx';
import Restaurant from './Restaurant.jsx';
import FilterMenu from './FilterMenu.jsx';

const Search = props =>
  (
    <div>
      <PhoneNumber onPhoneNumberSubmitClick={props.onPhoneNumberSubmitClick} />
      <br />
      <Restaurant onCitySubmitClick={props.onCitySubmitClick} 
        onRestaurantSubmitClick={props.onRestaurantSubmitClick}/>
      <br />
      <FilterMenu
        times={props.times}
        partySizes={props.partySizes}
        categories={props.categories}
        onFilterSubmitClick={props.onFilterSubmitClick}
      />
      <br />
    </div>
  );

export default Search;

Search.propTypes = {
  times: PropTypes.arrayOf(PropTypes.string).isRequired,
  partySizes: PropTypes.arrayOf(PropTypes.string).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPhoneNumberSubmitClick: PropTypes.func.isRequired,
  onCitySubmitClick: PropTypes.func.isRequired,
  onFilterSubmitClick: PropTypes.func.isRequired,
};
