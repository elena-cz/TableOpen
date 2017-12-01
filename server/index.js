const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const twilio = require('../helpers/twilioApi.js');
const { getRestaurantsByCity } = require('../helpers/yelpApi.js');
const {
  queryDatabaseForCity,
  saveNewCityData,
  generateReservationTimes,
  getCustomerReservations,
  bookReservation,
  cancelReservation,
  alreadySearched,
} = require('../helpers/utils.js');

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get restaurants and reservations for a particular city
app.post('/city', (request, response) => {
  // Check whether we have previously queried Yelp for this city
  // If this is a new city: query Yelp for data, store it in DB, send data to client
  alreadySearched(request.body.city).then((result) => {
    if (result === false) {
      getRestaurantsByCity(request.body.city)
        .then(yelpResults => saveNewCityData(yelpResults))
        .then(cityResults => generateReservationTimes(cityResults))
        .then((result) => {
          response.status(200);
          response.send(true);
        })
        .catch((err) => {
          throw err;
        });
    } else {
      response.status(200);
      response.send(true);
    }
  });
});

app.post('/reservations', (req, res) => {
  console.log(req.body.partySize);
  let city = req.body.city.split(',')[0];
  city = city.slice(0,1).toUpperCase() + city.slice(1,city.length).toLowerCase();
  city = city.split(' ');
  const formattedCity = `${city[0]} ${city[1].slice(0,1).toUpperCase() + city[1].slice(1,city[1].length)}`;
  queryDatabaseForCity(formattedCity, req.body.partySize).then((data) => {
    res.status(200);
    res.send(JSON.stringify(data));
  });
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
