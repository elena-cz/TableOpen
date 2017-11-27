import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const MyReservation = props => (
  <div>
    <ul>
      <li>Restaurant: {props.reservation.restaurant}</li>
      <li>Time: {moment(props.reservation.time).format('LT')}</li>
      <li>Party Size: {props.reservation.party}</li>
      <li>
        <button onClick={() => props.cancel(props.index, props.reservation)}>
          Cancel
        </button>
      </li>
    </ul>
  </div>
);

export default MyReservation;

MyReservation.propTypes = {
  index: PropTypes.number.isRequired,
  cancel: PropTypes.func.isRequired,
  reservation: PropTypes.shape({
    id: PropTypes.number.isRequired,
    restaurant: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    party: PropTypes.number.isRequired,
  }).isRequired,
};
