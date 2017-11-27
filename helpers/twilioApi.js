const axios = require('axios');
const { TWILIO_AUTH_TOKEN, TWILIO_DEFAULT_PHONE_NUMBER } = require('./config.js');
// const config = require('./config.js');
// const Promise = require('bluebird');

const accountSid ='Account Number would go here';
const authToken = 'Would be taken from config';

// const client = require('twilio')(accountSid, authToken);
// const client = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);


//Request format: https://{AccountSid}:{AuthToken}@api.twilio.com/2010-04-01/Accounts
//Helper functions to export

//LEFT HERE FOR REFERENCE
// let sendAcceptMsg = ()=>{
//     //Returns a promise
//     return  client.messages
//             .create({
//             to: '+TargetNumber(Would be one of ours)',
//             from: '+Twilio Number tied to the account',
//             body: 'Your reservation at RESTAURANT NAME at TIME is booked',
//             })
// }

// let sendCancelMsg = ()=>{
//     //Returns a promise
//     return  client.messages
//             .create({
//             to: '+TargetNumber(Would be one of ours)',
//             from: '+Twilio Number tied to the account',
//             body: 'Your reservation at RESTAURANT NAME at TIME is cancelled',
//             })
// }

const sendAcceptMsg = phoneNumber =>
  client.messages
    .create({
      to: phoneNumber,
      from: TWILIO_DEFAULT_PHONE_NUMBER,
      body: 'Your reservation at RESTAURANT NAME at TIME is booked',
    });

const sendCancelMsg = phoneNumber =>
  client.messages
    .create({
      to: phoneNumber,
      from: TWILIO_DEFAULT_PHONE_NUMBER,
      body: 'Your reservation at RESTAURANT NAME at TIME is cancelled',
    });

module.exports = {
  sendAcceptMsg,
  sendCancelMsg,
};
