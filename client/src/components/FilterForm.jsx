import React from 'react';
import PropTypes from 'prop-types';

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

  render() {

    const { timeFilter, restaurant, categoryFilter } = this.state;
    const { times, categories, onFilterSubmitClick } = this.props;

    return (
      <div>
        Select Your Desired Time
        <select onChange={this.onStateChange} name="timeFilter">
          {times.map(time =>
            <option key={time} value={time}>{time}</option>)}
        </select>

        Restaurant:
        <input
          type="text"
          name="restaurant"
          placeholder="Search for restaurant by name"
          onChange={this.onStateChange}
        />

        Select Your Food Category
        <select onChange={this.onStateChange} name="categoryFilter">
          {categories.map(category =>
            <option key={category} value={category}>{category}</option>)}
        </select>

        <button onClick={() => {
          onFilterSubmitClick(
            timeFilter,
            restaurant,
            categoryFilter,
            );
        }}
        >Submit
        </button>
      </div>
    );
  }
}

export default FilterForm;

FilterForm.propTypes = {
  times: PropTypes.arrayOf(PropTypes.string).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterSubmitClick: PropTypes.func.isRequired,
};
