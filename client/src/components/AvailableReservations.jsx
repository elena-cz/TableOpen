import React from 'react';
import PropTypes from 'prop-types';
import RestaurantEntry from './RestaurantEntry.jsx';

const AvailableReservations = props =>
  (
    <div>
      Available Reservations
      <div>RESTAURANTS: {props.restaurantData.length}</div>
      {props.restaurantData.map(restaurant =>
        (<RestaurantEntry
          key={restaurant.name}
          restaurant={restaurant}
          time={props.time}
          party={props.party}
          onAcceptClick={props.onAcceptClick}
        />))}
    </div>
  );


export default AvailableReservations;

AvailableReservations.propTypes = {
  time: PropTypes.string.isRequired,
  party: PropTypes.string.isRequired,
  restaurantData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
  onAcceptClick: PropTypes.func.isRequired,
};
