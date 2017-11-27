const _ = require('underscore');
const moment = require('moment');
const { getRestaurantsByCity } = require('../helpers/yelpApi.js');
const { seedNewCity } = require('../database/index.js');

const seedDatabase = (location = 'San Francisco, CA') => {
  // storage array for all of the Yelp restaurant data for a particular city
  let cityData = [];
  // an array of all the async Yelp queries we'll need to run
  const yelpQueries = [];

  // gather one page of restaurants from Yelp and store in cityData array
  const getOnePageOfRestaurants = (city, pageNumber) => new Promise((resolve, reject) => {
    getRestaurantsByCity(city, pageNumber)
      .then((partialResults) => {
        cityData = cityData.concat(partialResults.data.businesses);
        resolve(partialResults);
      })
      .catch(err => reject(err));
  });

  // each page from Yelp has 50 restaurants; this will pull 1000 restaurants for a given city
  for (let page = 1; page < 3; page += 1) {
    yelpQueries.push(getOnePageOfRestaurants(location, page));
  }

  Promise.all(yelpQueries)
    .then(() => {
      seedNewCity(cityData);
      console.log(`Number of restaurants in DB for San Francisco: ', ${cityData.length}`);
    });
};


const formatCityResults = (cityResults) => {
  const restaurants = {};

  _.forEach(cityResults.rows, (rest) => {
    if (restaurants.hasOwnProperty(rest.name)) {
      restaurants[rest.name].reservations.push({
        time: JSON.parse(rest.time),
        people: rest.party_size,
        id: rest.id,
        booked: rest.isReservationBooked,
      });
    } else {
      // create restaurant key in the restaurants object
      restaurants[rest.name] = {
        name: rest.name,
        image_url: rest.image,
        reservations: [],
        category: rest.category,
      };
      restaurants[rest.name].reservations.push({
        time: JSON.parse(rest.time),
        people: rest.party_size,
        id: rest.id,
        booked: rest.isReservationBooked,
      });
    }
  });
  const data = _.map(restaurants, (item) => {
    const output = {
      name: item.name,
      image_url: item.image_url,
      reservations: item.reservations,
      partySizes: item.reservations.map(slot => slot.people),
      times: item.reservations.map(slot => moment(slot.time).format('LT')),
      categories: [item.category],
    };
    return output;
  });
  return data;
};

module.exports = {
  seedDatabase,
  formatCityResults,
};
