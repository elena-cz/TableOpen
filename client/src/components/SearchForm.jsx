import React from 'react';
import PropTypes from 'prop-types';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      partyFilter: 'All',
    };

    this.onStateChange = this.onStateChange.bind(this);
  }

  onStateChange(e) {
    this.setState({
      [e.target.name]: e.target.value, 
    });
  }

  render() {
    const { city, partyFilter } = this.state;
    const { onSearchSubmitClick } = this.props;

    return (
      <div>
        City:
        <input
          type="text"
          name="city"
          placeholder="San Francisco, CA"
          onChange={this.onStateChange}
        />
        Select Your Party Size
        <select onChange={this.onStateChange} name="partyFilter">
          {[2, 4, 6, 8].map(size =>
            <option key={size} value={size}>{size}</option>)}
        </select>
        <button onClick={() =>
          onSearchSubmitClick(city, partyFilter)}
        >
          Submit
        </button>
      </div>);
  }
}

export default SearchForm;

SearchForm.propTypes = {
  onSearchSubmitClick: PropTypes.func.isRequired,
};
