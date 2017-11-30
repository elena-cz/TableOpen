const _ = require('underscore');
const moment = require('moment');
const { getRestaurantsByCity } = require('../helpers/yelpApi.js');
const { client } = require('../database/index.js');
const { sendConfirmationText, sendCancellationText } = require('../helpers/twilioApi.js');
const db = require('../database/helpers.js');
const bookshelf = require('../database/index').bookshelf;
const Promise = require('bluebird');
const Reservation = require('../database/models/Reservations');

// Create 1-3 reservations for a given restaurant
// const generateReservations = (restaurantId, time) => {
//   const reservations = [];

//     // 2) randomly generate the start time for this reservation
//     const reservationTimeCalculator = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6);
//     /*
//     Reservation start times range from 5pm to 10pm, inclusive
//     Weighting of odds for start times is similar to dice probabilties
//     7:30 is the most common start time, and 5pm/10pm are the least likely start times
//     */
//     const reservationTime = moment().startOf('day').add(12 + (reservationTimeCalculator * 0.5), 'hours');

//     // 3) insert this reservation into 'reservations' table in DB
//     // (restaurant_id, party_size, customer_id, time)

//     return reservations.push(db.addReservationToDatabase(restaurantId, false, partySize, null, reservationTime));
//   }
//   return Promise.all(reservations);
// };
const generatePopularity = (restaurant) => {
  if (restaurant.review_count < 500) {
    var popularity = 0;
  }
  if (restaurant.review_count > 500 && restaurant.review_count < 750) {
    var reservationCalculator = newFunction();
    if (reservationCalculator <= 5) {
      var popularity = 0;
    } else {
      var popularity = 30;
    }
  }
  if (restaurant.review_count > 750) {
    var reservationCalculator = Math.ceil(Math.random() * 10);
    if (reservationCalculator <= 5) {
      var popularity = 0;
    } else {
      var popularity = 60;
    }
  }
  return popularity;
};
const generateReservationTimes = (result, hour) => {
  const cityData = [];
  result.businesses.forEach((restaurant) => {
    const reservations = [];
    for (let j = 5; j < 11; j++) {
      var restaurantData = [restaurant];
      var popularity = generatePopularity(restaurant);
      for (let i = popularity; i < 60; i += 30) {
        let partysize = Math.ceil((Math.random()) * 7) + 1;
        if (partysize % 2 !== 0) {
          partysize++;
        }
        if (popularity === 30) {
          if (Math.ceil(Math.random() * 10) <= 5) {
            var minutes = '00';
          } else {
            var minutes = `${30}`;
          }
        } else if (popularity === 0) {
          if (i.toString().length === 1) {
            var minutes = '00';
          } else {
            var minutes = `${30}`;
          }
        }
        const time = `${j}:${minutes}pm`;
        const singleReservation = [time, partysize];
        reservations.push(singleReservation);
      }
    }
    restaurantData.push(reservations);
    cityData.push(restaurantData);
  });
  return cityData;
};


// (name, category, address, city, state, zip, phone, url, image, review_count, rating)
const saveNewCityData = data => Promise.map(data, restaurant => db.addRestaurantToDataBase(restaurant.name, restaurant.categories[0].title, `${restaurant.location.address1} ${restaurant.location.address2} ${restaurant.location.address3}`, restaurant.location.city, restaurant.location.state, restaurant.location.zip_code, restaurant.display_phone, restaurant.url, restaurant.image_url, restaurant.review_count, restaurant.rating)).then((result) => {
  generateReservationTimes(result);
  return result;
});


// const seedDatabase = (location = 'San Francisco, CA') => {
//   // storage array for all of the Yelp restaurant data for a particular city
//   let cityData = [];
//   // gather one page of restaurants from Yelp and store in cityData array
//   const getOnePageOfRestaurants = (city, pageNumber) => new Promise((resolve, reject) => {
//     getRestaurantsByCity(city, pageNumber)
//       .then((partialResults) => {
//         cityData = cityData.concat(partialResults.data.businesses);
//         resolve(partialResults);
//       })
//       .catch(err => reject(err));
//   });

//   // an array of all the async Yelp queries we'll need to run
//   const yelpQueries = [];
//   // each page from Yelp has 50 restaurants; this will pull 1000 restaurants for a given city
//   for (let page = 0; page < 20; page += 1) {
//     yelpQueries.push(getOnePageOfRestaurants(location, page));
//   }

//   Promise.all(yelpQueries)
//     .then(() => {
//       saveNewCityData(cityData);
//     });
// };

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


// const queryDatabaseForCity = city => new Promise((resolve, reject) => {
//   const temp = city.split(',');
//   const City = temp[0];
//   const State = temp[1].slice(1);
//   Promise.resolve(Reservation.where({
//     isReservationBooked: false,
//   }).fetchAll({ withRelated: ['restaurant'] }).then((data) => {
//     console.log('this is the', data);
  // }));
  // .then((results) => {
  //   resolve(results);
  // })
  // .catch((err) => {
  //   reject(err);
  // });
// });


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
  // queryDatabaseForCity,
  // getCustomerReservations,
  // bookReservation,
  // cancelReservation,
};
