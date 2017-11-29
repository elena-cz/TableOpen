const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const twilio = require('../helpers/twilioApi.js');
const { getRestaurantsByCity } = require('../helpers/yelpApi.js');
const { seedDatabase,
        formatCityResults,
        saveNewCityData,
        queryDatabaseForCity,
        getCustomerReservations,
        bookReservation,
        cancelReservation } = require('../helpers/utils.js');

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize the database with a yelp query for 1000 SF restaurants
seedDatabase();

const visitedCities = ['San Francisco, CA'];

// App will initially load with SF as the default city
app.get('/data', (request, response) => {
  queryDatabaseForCity()
    .then(cityResults => response.send(formatCityResults(cityResults)))
    .catch((err) => {
      throw err;
    });
});

// Get restaurants and reservations for a particular city
app.post('/city', (request, response) => {
  // Check whether we have previously queried Yelp for this city
  if (!visitedCities.includes(request.body.city)) {
    // If this is a new city: query Yelp for data, store it in DB, send data to client
    visitedCities.push(request.body.city);
    getRestaurantsByCity(request.body.city)
      .then(yelpResults => saveNewCityData(yelpResults.businesses))
      .then(() => queryDatabaseForCity(request.body.city))
      .then(cityResults => response.send(formatCityResults(cityResults)))
      .catch((err) => {
        throw err;
      });
  } else {
    // We'll skip the Yelp query if this city's data is already in the DB
    queryDatabaseForCity(request.body.city)
      .then(cityResults => response.send(formatCityResults(cityResults)))
      .catch((err) => {
        throw err;
      });
  }
});

app.post('/book', (request, response) => {
  bookReservation(request.body.reservationId, request.body.phoneNumber)
    .then(results => response.send(results.rows));
});

app.put('/cancel', (request, response) => {
  cancelReservation(request.body.reservationId)
    .then(results => response.send(results.rows));
});

app.post('/user', (request, response) => {
  getCustomerReservations(request.body.phoneNumber)
    .then(results => response.send(results.rows));
});

app.listen(PORT, () => console.log(`The TableOpen server is listening on port ${PORT}!`));
