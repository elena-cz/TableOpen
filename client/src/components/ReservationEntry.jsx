import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const ReservationEntry = props =>
  (
    <div key={props.reservation.time}>
    Reservation Time:{moment(props.reservation.time).format('LT')}<br />
    Party Size: {props.reservation.people}
      <button onClick={() => props.accept(props.reservation, props.restaurant)}>Accept
      </button>
    </div>);

export default ReservationEntry;

ReservationEntry.propTypes = {
  reservation: PropTypes.shape({
    time: PropTypes.string,
    people: PropTypes.number,
  }).isRequired,
};
