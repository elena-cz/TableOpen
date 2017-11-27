import React from 'react';
import PropTypes from 'prop-types';

class Restaurant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: '',
      city: '',
    };

    this.onStateChange = this.onStateChange.bind(this);
  }

  onStateChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        City:
        <input
          type="text"
          name="city"
          placeholder="San Francisco, CA"
          onChange={this.onStateChange}
        />
        <button onClick={() =>
          this.props.onCitySubmitClick(this.state.city)}
        >
          Submit
        </button>
        <div>
          <br />
          Restaurant:
          <input
            type="text"
            name="restaurant"
            placeholder="Search for restaurant by name"
            onChange={this.onStateChange}
          />
          <button onClick={() => {
            this.props.onRestaurantSubmitClick(this.state.restaurant);
          }}
          >
            Search
          </button>
        </div>
      </div>);
  }
}

export default Restaurant;

Restaurant.propTypes = {
  onCitySubmitClick: PropTypes.func.isRequired,
  onRestaurantSubmitClick: PropTypes.func.isRequired,
};
