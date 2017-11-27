const moment = require('moment');
const {
  TWILIO_AUTH_TOKEN,
  TWILIO_DEFAULT_VOIP_PHONE_NUMBER,
  TWILIO_DEFAULT_CUSTOMER_NUMBER,
  TWILIO_ACCOUNT_SID,
} = require('./config.js');
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendConfirmationText = (reservation, phoneNumber = TWILIO_DEFAULT_CUSTOMER_NUMBER) => {
  const displayTime = reservation.time.split('\"').join('');
  return client.messages
    .create({
      to: phoneNumber,
      from: TWILIO_DEFAULT_VOIP_PHONE_NUMBER,
      body: `Your reservation at ${reservation.restaurant_id} for ${reservation.party_size} people starting at ${moment(displayTime).format('LT')} has been confirmed!`,
    });
};

const sendCancellationText = (reservation, phoneNumber = TWILIO_DEFAULT_CUSTOMER_NUMBER) => {
  const displayTime = reservation.time.split('\"').join('');
  return client.messages
    .create({
      to: phoneNumber,
      from: TWILIO_DEFAULT_VOIP_PHONE_NUMBER,
      body: `Your reservation at ${reservation.restaurant_id} for ${reservation.party_size} people starting at ${moment(displayTime).format('LT')} has been cancelled.`,
    });
};


module.exports = {
  sendConfirmationText,
  sendCancellationText,
};
