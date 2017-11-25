import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import ReservationEntry from './ReservationEntry.jsx';

const RestaurantEntry = props =>
  (
    <div>
      <div>{props.restaurant.name}</div>
      <img width="210px" height="170px" src={props.restaurant.image_url} alt="pic of restaurant" />
      {props.restaurant.reservations.map(reservation =>
        (
          <div key={reservation.id}>{
          (moment(reservation.time).format('LT') === props.time || props.time === 'All')
          && (reservation.people.toString() === props.party || props.party === 'All')
          && <ReservationEntry key={reservation.time} reservation={reservation} />
          }
          </div>))}
    </div>);

export default RestaurantEntry;

RestaurantEntry.propTypes = {
  restaurant: PropTypes.shape({
    name: PropTypes.string,
    image_url: PropTypes.string,
    reservations: PropTypes.arrayOf(PropTypes.shape({
      time: PropTypes.string,
      people: PropTypes.number,
    })).isRequired,
  }).isRequired,
  time: PropTypes.string.isRequired,
  party: PropTypes.string.isRequired,
};
