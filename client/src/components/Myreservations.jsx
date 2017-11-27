import React from 'react';
import PropTypes from 'prop-types';
import MyReservation from './Myreservation.jsx';

const MyReservations = props => (

  <div className="myReservations">
  My Reservations
    {(props.reservations.length === 0) ?
      <div>No Reservations</div> : props.reservations.map((reservation, idx) =>
        (
          <MyReservation
            reservation={reservation}
            key={reservation.id}
            index={idx}
            cancel={props.onCancelClick}
          />
        ))}
  </div>
);

export default MyReservations;

MyReservations.propTypes = {
  onCancelClick: PropTypes.func.isRequired,
  reservations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    restaurant: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    party: PropTypes.number.isRequired,
  })).isRequired,
};
