import React from 'react';
import PropTypes from 'prop-types';

const ReservationList = props =>
  (
    <div>
      {props.restaurantData.map(restaurant =>
        (
          <ul key={restaurant.id}>
            {restaurant.name}<br />
            <img src={restaurant.image_url} alt="pic of restaurant" />
            {restaurant.reservations.map(reservation =>
            (
              <div key={reservation.time}>
              Reservation Time:{reservation.time}<br />
              Party Size: {reservation.people}
                <button>Accept</button>
              </div>))}
          </ul>))}
    </div>
  );

export default ReservationList;

ReservationList.propTypes = {
  restaurantData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
};
