const _ = require('underscore');
const moment = require('moment');
const { getRestaurantsByCity } = require('../helpers/yelpApi.js');
const { client } = require('../database/index.js');
const { sendConfirmationText, sendCancellationText } = require('../helpers/twilioApi.js');
const db = require('../database/helpers.js');
const bookshelf = require('../database/index').bookshelf;
const Promise = require('bluebird');
const Reservation = require('../database/models/Reservations');
const Restaurant = require('../database/models/Restaurants');
const SearchedCity = require('../database/models/SearchedCities');


const alreadySearched = city => SearchedCity.query({
  where: {
    city,
  },
}).fetchAll()
  .then((results) => {
    if (results.length === 0) {
      return db.addCityToDatabase(city).then((result) => false);
    }
    return true;
  });

const generatePopularity = (restaurant) => {
  if (restaurant.review_count < 500) {
    var popularity = 1;
  }
  if (restaurant.review_count > 500 && restaurant.review_count < 750) {
    var reservationCalculator = Math.ceil(Math.random() * 10);
    if (reservationCalculator <= 5) {
      var popularity = 2;
    } else {
      var popularity = 3;
    }
  }
  if (restaurant.review_count > 750) {
    var reservationCalculator = Math.ceil(Math.random() * 10);
    if (reservationCalculator <= 8) {
      var popularity = 4;
    } else {
      var popularity = 5;
    }
  }
  return popularity;
};

const isBooked = (popularity) => {
  if (popularity < 3) {
    return false;
  }
  return true;
};

const generateReservationTimes = (data) => {
  const promise = [];
  data.forEach((restaurant) => {
    for (let j = 5; j < 11; j++) {
      for (let i = 0; i < 10; i++) {
        let popularity = generatePopularity(restaurant.attributes);
        let isReservationBooked = isBooked(popularity);
        promise.push(db.addReservationToDatabase(restaurant.id, isReservationBooked, 2, null, `${j}:00`));
        popularity = generatePopularity(restaurant.attributes);
        isReservationBooked = isBooked(popularity);
        promise.push(db.addReservationToDatabase(restaurant.id, isReservationBooked, 2, null, `${j}:30`));
      }
      for (let k = 0; k < 6; k++) {
        let popularity = generatePopularity(restaurant.attributes);
        let isReservationBooked = isBooked(popularity);
        promise.push(db.addReservationToDatabase(restaurant.id, isReservationBooked, 4, null, `${j}:00`));
        popularity = generatePopularity(restaurant.attributes);
        isReservationBooked = isBooked(popularity);
        promise.push(db.addReservationToDatabase(restaurant.id, isReservationBooked, 4, null, `${j}:30`));
      }
      for (let h = 0; h < 6; h++) {
        let popularity = generatePopularity(restaurant.attributes);
        let isReservationBooked = isBooked(popularity);
        promise.push(db.addReservationToDatabase(restaurant.id, isReservationBooked, 4, null, `${j}:00`));
        popularity = generatePopularity(restaurant.attributes);
        isReservationBooked = isBooked(popularity);
        promise.push(db.addReservationToDatabase(restaurant.id, isReservationBooked, 4, null, `${j}:30`));
      }
      for (let l = 0; l < 4; l++) {
        let popularity = generatePopularity(restaurant.attributes);
        let isReservationBooked = isBooked(popularity);
        promise.push(db.addReservationToDatabase(restaurant.id, isReservationBooked, 8, null, `${j}:00`));
        popularity = generatePopularity(restaurant.attributes);
        isReservationBooked = isBooked(popularity);
        promise.push(db.addReservationToDatabase(restaurant.id, isReservationBooked, 8, null, `${j}:30`));
      }
    }
  });
  return Promise.all(promise).then(data => data);
};

// (name, category, address, city, state, zip, phone, url, image, review_count, rating)
const saveNewCityData = data => Promise.map(data.businesses, restaurant => db.addRestaurantToDataBase(restaurant.name, restaurant.categories[0].title, `${restaurant.location.address1} ${restaurant.location.address2} ${restaurant.location.address3}`, restaurant.location.city, restaurant.location.state, restaurant.location.zip_code, restaurant.display_phone, restaurant.url, restaurant.image_url, restaurant.review_count, restaurant.rating, '')).then(res => res);


// const formatCityResults = (cityResults) => {
//   const restaurants = {};
//   return Promise.map(cityResults, (rest) => {
//     restaurants[rest.attributes.name] = {
//       name: rest.attributes.name,
//       image_url: rest.attributes.image,
//       category: rest.attributes.category,
//     };
//   }).then(() => {
//     const data = _.map(restaurants, (item) => {
//       const output = {
//         name: item.name,
//         image_url: item.image_url,
//         categories: [item.category],
//         reservations: item.reservations,
//       };
//       return output;
//     });
//     return data;
//   }).then((data) => data);
// };


const queryDatabaseForCity = (city, party_size) => new Promise((resolve, reject) => {
  Restaurant.query({
    where: {
      city,
    },
  }).fetchAll({ withRelated: ['reservation'] }).then((data) => data).then((results) => {
    resolve(results);
  });
}).then((reservations) => {
  const restaurants = [];
  return Promise.map(reservations.models, (item) => {
    const limit = {};
    let arrayHolder = [];
    for (let i = 0; i < item.relations.reservation.models.length; i++) {
      if (item.relations.reservation.models[i].attributes.isReservationBooked === false && item.relations.reservation.models[i].attributes.party_size === party_size && limit[`${item.relations.reservation.models[i].attributes.party_size}${item.relations.reservation.models[i].attributes.time}`] !== true) {
        arrayHolder.push(item.relations.reservation.models[i].attributes);
        limit[`${item.relations.reservation.models[i].attributes.party_size}${item.relations.reservation.models[i].attributes.time}`] = true;
      }
    }
    item.attributes.reservations = arrayHolder;
    restaurants.push(item.attributes);
  }).then(() => {
    return restaurants;
  });
});


// const getCustomerReservations = (phoneNumber = '555-867-5309') => new Promise((resolve, reject) => {
//   Promise.resolve(client.query(
//     `SELECT restaurants.name, reservations.id, reservations.time, reservations.party_size, customers.phone
//       FROM reservations, restaurants, customers
//       WHERE (
//       reservations.restaurant_id = restaurants.id AND
//       reservations.customer_id = customers.id AND
//       customers.phone = $1)`,
//     [phoneNumber]
// ))
//     .then((results) => {
//       resolve(results);
//     })
//     .catch((err) => {
//       reject(err);
//     });
// });


// const bookReservation = (reservationId, phoneNumber = '555-867-5309') => new Promise((resolve, reject) => {
//   Promise.resolve(client.query(
//     `SELECT *
//       FROM customers
//       WHERE customers.phone = $1`,
//     [phoneNumber],
//   ))
//     .then((results) => {
//       if (results.rows.length) {
//         // User is an existing customer
//         Promise.resolve(client.query(
//           `UPDATE reservations
//             SET isReservationBooked = TRUE, customer_id = $1
//             WHERE reservations.id = $2
//             RETURNING reservations.id`,
//           [results.rows[0].id, reservationId],
//         ))
//           .then((bookingConfirmation) => {
//             resolve(bookingConfirmation);
//           })
//           .catch(err => reject(err));
//       } else {
//         // This user is new; we need to add them to the customers table in the DB
//         // Then, we'll use their newly assigned ID to finish assigning this reservation to them
//         Promise.resolve(client.query(
//           `INSERT
//             INTO customers
//             VALUES (DEFAULT, $1) RETURNING id`,
//           [phoneNumber]
// ))
//           .then((customerId) => {
//             Promise.resolve(client.query(
//               `UPDATE reservations
//                 SET isReservationBooked = TRUE, customer_id = $1
//                 WHERE reservations.id = $2
//                 RETURNING *`,
//               [customerId.rows[0].id, reservationId],
//             ))
//               .then((bookingConfirmation) => {
//                 sendConfirmationText(bookingConfirmation.rows[0]);
//                 resolve(bookingConfirmation);
//               })
//               .catch(err => reject(err));
//           })
//           .catch(err => reject(err));
//       }
//     })
//     .catch(err => reject(err));
// });


// const cancelReservation = reservationId => new Promise((resolve, reject) => {
//   Promise.resolve(client.query(
//     `UPDATE reservations
//       SET isReservationBooked = FALSE, customer_id = NULL
//       WHERE reservations.id = $1
//       RETURNING *`,
//     [reservationId]
// ))
//     .then((cancellingConfirmation) => {
//       sendCancellationText(cancellingConfirmation.rows[0]);
//       resolve(cancellingConfirmation);
//     })
//     .catch(err => reject(err));
// });


module.exports = {
  generateReservationTimes,
  // formatCityResults,
  saveNewCityData,
  queryDatabaseForCity,
  alreadySearched,
  // getCustomerReservations,
  // bookReservation,
  // cancelReservation,
};
