import React from 'react';
import PropTypes from 'prop-types';

const PhoneNumber = props =>
  (
    <div>
      Phone #:
      <input
        type="text"
        name="phoneNumber"
        placeholder="555-555-5555"
        value={props.phoneNumber}
        onChange={e => props.onStateChange(e)}
      />
      <button onClick={() => props.onPhoneNumberSubmitClick(props.phoneNumber)}>
        Submit
      </button>
    </div>
  );

export default PhoneNumber;

PhoneNumber.propTypes = {
  onPhoneNumberSubmitClick: PropTypes.func.isRequired,
  onStateChange: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string.isRequired,
};
