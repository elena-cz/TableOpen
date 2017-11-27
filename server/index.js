const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const twilio = require('../helpers/twilioApi.js');
const { getRestaurantsByCity } = require('../helpers/yelpApi.js');
// const { seedNewCity, queryCity } = require('../database/index.js');
const { seedDatabase,
        formatCityResults,
        getCustomerReservations,
        seedNewCity,
        queryCity,
        bookReservation,
        cancelReservation } = require('../helpers/utils.js');

const PORT = 3000;
const app = express();
const visitedCities = ['San Francisco, CA'];

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize the database with a yelp query for 1000 SF restaurants
seedDatabase();

app.get('/data', (request, response) => {
  // GETS SF DATA AS INITIAL SEED
  queryCity('San Francisco')
    .then((cityResults) => {
      const data = formatCityResults(cityResults);
      response.send(data);
    })
    .catch((err) => {
      throw err;
    });
});

app.post('/data/city', (request, response) => {
  // Route for getting restaurants for particular city
  // Check visited cities array to see if we have already found it
  if (!visitedCities.includes(request.body.city)) {
    visitedCities.push(request.body.city);
    getRestaurantsByCity(request.body.city)
      .then((results) => {
        seedNewCity(results.data.businesses)
          .then(() => {
            queryCity(request.body.city)
              .then((cityResults) => {
                const data = formatCityResults(cityResults);
                response.send(data);
              })
              .catch((err) => {
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  } else {
    queryCity(request.body.city)
      .then((cityResults) => {
        const data = formatCityResults(cityResults);
        response.send(data);
      })
      .catch((err) => {
        throw err;
      });
  }
});

app.post('/book', (request, response) => {
  bookReservation(request.body.reservationId, request.body.phoneNumber)
    .then(results => {
      response.send(results);
    });
});

app.put('/cancel', (request, response) => {
  cancelReservation(request.body.reservationId)
    .then(results => {
      response.send(results.rows);
    });
});

app.get('/user', (request, response) => {
  getCustomerReservations(request.body.phoneNumber)
    .then(results => response.send(results.rows));
});

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
