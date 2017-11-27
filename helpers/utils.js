const _ = require('underscore');
const moment = require('moment');
const { getRestaurantsByCity } = require('../helpers/yelpApi.js');
const { client } = require('../database/index.js');

// Create 1-3 reservations for a given restaurant
const generateFakeReservations = (restaurantId) => {
  const reservations = [];

  const reservationCount = Math.ceil(Math.random() * 3);
  for (let i = 0; i < reservationCount; i += 1) {
    // 1) randomly generate the party size for this reservation
    const partySizeCalculator = Math.ceil(Math.random() * 6);
    let partySize = null;
    // Reservations with parties of 2 and 4 are twice as likely as parties of 6 and 8
    if (partySizeCalculator < 3) {
      partySize = 2;
    } else if (partySizeCalculator < 5) {
      partySize = 4;
    } else if (partySizeCalculator < 6) {
      partySize = 6;
    } else {
      partySize = 8;
    }

    // 2) randomly generate the start time for this reservation
    const reservationTimeCalculator = Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6);
    /*
    Reservation start times range from 5pm to 10pm, inclusive
    Weighting of odds for start times is similar to dice probabilties
    7:30 is the most common start time, and 5pm/10pm are the least likely start times
    */
    const reservationTime = moment().startOf('day').add(16 + (reservationTimeCalculator * 0.5), 'hours');

    // 3) insert this reservation into 'reservations' table in DB
    reservations.push(client.query(
      `INSERT INTO reservations
      VALUES (DEFAULT, $1, $2, $3, DEFAULT, DEFAULT)`,
      [restaurantId, reservationTime, partySize]
    ));
  }
  return Promise.all(reservations);
};

const saveNewCityData = (data) => {
  const restaurants = data.map((restaurant) => {
    return new Promise((resolve, reject) => {
      Promise.resolve(client.query(
        `INSERT 
        INTO restaurants 
        VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [restaurant.name, restaurant.categories[0].title, restaurant.location.address1 + ' ' + restaurant.location.address2 + ' ' + restaurant.location.address3, restaurant.location.city, restaurant.location.state, restaurant.location.zip_code, restaurant.url, restaurant.image_url, restaurant.display_phone, restaurant.review_count, restaurant.rating]
      ))
        .then((resultingID) => {
          generateFakeReservations(resultingID.rows[0].id)
            .then((res) => {
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        });
    });
  });
  return Promise.all(restaurants);
};

const seedDatabase = (location = 'San Francisco, CA') => {
  // storage array for all of the Yelp restaurant data for a particular city
  let cityData = [];

  // gather one page of restaurants from Yelp and store in cityData array
  const getOnePageOfRestaurants = (city, pageNumber) => new Promise((resolve, reject) => {
    getRestaurantsByCity(city, pageNumber)
      .then((partialResults) => {
        cityData = cityData.concat(partialResults.data.businesses);
        resolve(partialResults);
      })
      .catch(err => reject(err));
  });

  // an array of all the async Yelp queries we'll need to run
  const yelpQueries = [];
  // each page from Yelp has 50 restaurants; this will pull 1000 restaurants for a given city
  for (let page = 0; page < 20; page += 1) {
    yelpQueries.push(getOnePageOfRestaurants(location, page));
  }

  Promise.all(yelpQueries)
    .then(() => {
      saveNewCityData(cityData);
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


const queryDatabaseForCity = (city = 'San Francisco') => {
  return new Promise((resolve, reject) => {
    Promise.resolve(client.query(
      `SELECT restaurants.name, restaurants.category, restaurants.image, reservations.id, reservations.time, reservations.party_size 
      FROM reservations, restaurants 
      WHERE (reservations.restaurant_id = restaurants.id AND restaurants.city = $1 AND reservations.isReservationBooked = FALSE)`, [city]))
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


const createNewCustomer = (phoneNumber = '555-867-5309') => {
  return new Promise((resolve, reject) => {
    Promise.resolve(client.query(
      `INSERT 
      INTO customers 
      VALUES (DEFAULT, $1) RETURNING id`,
      [phoneNumber]))
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


const getCustomerReservations = (phoneNumber = '555-867-5309') => {
  return new Promise((resolve, reject) => {
    Promise.resolve(client.query(
      `SELECT restaurants.name, restaurants.category, reservations.id, reservations.time, reservations.party_size, customers.phone 
      FROM reservations, restaurants, customers 
      WHERE (
      reservations.restaurant_id = restaurants.id AND 
      reservations.customer_id = customers.id AND 
      customers.phone = $1)`,
      [phoneNumber]))
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


const bookReservation = (reservationId, phoneNumber = '555-867-5309') => {
  return new Promise((resolve, reject) => {
    Promise.resolve(client.query(
      `SELECT * 
      FROM customers 
      WHERE customers.phone = $1`,
      [phoneNumber]
    ))
      .then((results) => {
        if (results.rows.length) {
          // User is an existing customer
          Promise.resolve(client.query(
            `UPDATE reservations
            SET isReservationBooked = TRUE, customer_id = $1
            WHERE reservations.id = $2
            RETURNING reservations.id`,
            [results.rows[0].id, reservationId]
          ))
            .then((bookingConfirmation) => {
              resolve(bookingConfirmation);
            })
            .catch(err => reject(err));
        } else {
          // This user is new; we gotta add them to the customers table in the DB
          // Then, we'll use their newly assigned ID to finish assigning this reservation to them
          Promise.resolve(client.query(
            `INSERT 
            INTO customers 
            VALUES (DEFAULT, $1) RETURNING id`,
            [phoneNumber]))
            .then((customerId) => {
              Promise.resolve(client.query(
                `UPDATE reservations
                SET isReservationBooked = TRUE, customer_id = $1
                WHERE reservations.id = $2 
                RETURNING reservations.id`,
                [customerId.rows[0].id, reservationId]
              ))
                .then((bookingConfirmation) => {
                  resolve(bookingConfirmation);
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  });
};


const cancelReservation = (reservationId) => {
  return new Promise((resolve, reject) => {
    Promise.resolve(client.query(
      `UPDATE reservations
      SET isReservationBooked = FALSE, customer_id = NULL
      WHERE reservations.id = $1
      RETURNING reservations.id`,
      [reservationId]))
      .then((cancellingConfirmation) => {
        resolve(cancellingConfirmation);
      })
      .catch(err => reject(err));
  });
};


module.exports = {
  seedDatabase,
  formatCityResults,
  saveNewCityData,
  queryDatabaseForCity,
  getCustomerReservations,
  bookReservation,
  cancelReservation,
};
