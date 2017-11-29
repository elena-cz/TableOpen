const axios = require('axios');
// const config = require('./config.js');

/*

How to use the YELP API:
(Note that we used the API's 3rd version, aka 'Yelp Fusion')

1) Do a POST Request to this address to get your access_token:
   https://api.yelp.com/oauth2/token?client_id={client_id}&client_secret={client_secret}

   The response body will have an 'access_token' that you'll need to send with every API query.
   This token will go in the request header - we must specify an authorization key, like so:

   headers: {
     authorization: 'Bearer <insert_your_access_token_here>',
   }

2) Now, attach this header when you send GET reqeusts to the following URL:
   https://api.yelp.com/v3/businesses/search?location={}&term=restaurants&limit={}&offset={}
     where location value = 'city+state'
     where limit = 50 (that's the max values that Yelp allows per GET request)
     where offset = the page of results you want to see

For additional information please visit:
https://www.yelp.com/developers/documentation/v3

*/

// const access = config.YELP_ACCESS_TOKEN;
// const yelpHeaders = {
//   headers: {
//     Authorization: `Bearer ${access}`,
//   },
// };

// const getRestaurantsByCity = (cityAndState = 'San Francisco, CA', page = 0) => {
//   const offset = page * 50;
//   const parsedCityAndState = cityAndState.split(', ');
//   const locationQuery = `${parsedCityAndState[0].split(' ').join('+')},+${parsedCityAndState[1]}`;
//   return axios.get(`https://api.yelp.com/v3/businesses/search?location=${locationQuery}&term=restaurants&limit=50&offset=${offset}`, yelpHeaders);
// };

// module.exports = {
//   getRestaurantsByCity,
// };


const yelpHeaders = {
  headers: {
    Authorization: 'Bearer',
  },
};

const getRestaurantsByCity = (cityAndState, page = 0) => {
  const offset = page * 50;
  const parsedCityAndState = cityAndState.split(', ');
  const locationQuery = `${parsedCityAndState[0].split(' ').join('+')},+${parsedCityAndState[1]}`;
  return axios.post('https://api.yelp.com/oauth2/token?client_id=vF-UDqkCAozh9YRaJRWy9w&client_secret=c1QEtIT3LxVHbVVusduJc1cdz3e3fe0B0huv5NFVuaeMbKvW9Yiumrgntvz66lT3').then((result) => result.data.access_token).then((result) => {
    const yelpHeaders = {
      headers: {
        Authorization: `Bearer ${result}`,
      },
    };
    return axios.get(`https://api.yelp.com/v3/businesses/search?location=${locationQuery}&term=restaurants&limit=50&offset=${offset}`, yelpHeaders).then((result) => {
      return result.data;
    });
  });
};

module.exports = {
  getRestaurantsByCity,
};