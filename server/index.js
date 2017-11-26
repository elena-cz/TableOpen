const express = require('express');
const bodyParser = require('body-parser');
const { getRestaurantsByCity } = require('../helpers/yelpApi.js');
// const twilio = require('../helpers/twilioApi.js');
// const _ = require('underscore');
const path = require('path');
// const moment = require('moment');
const { seedNewCity, queryCity } = require('../database/index.js');
const { seedDatabase, formatCityResults } = require('../helpers/utils.js');

const PORT = 3000;
const app = express();
let visitedCities = ['San Francisco, CA'];

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize the database with a yelp query for 1000 SF restaurants
seedDatabase();

app.get('/data', (request, response) => {
  // GETS SF DATA AS INITIAL SEED
  getRestaurantsByCity()
    .then((results) => {
      seedNewCity(results.data.businesses)
        .then(() => {
          queryCity()
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
    }).catch((err) => {
      throw err;
    });
});

app.post('/data/city', (request, response) => {
  // Route for getting restaurants for particular city
  // Check visited cities array to see if we have already found it
  if (visitedCities.indexOf(request.body.city) < 0) {
    getRestaurantsByCity(request.body.city)
      .then((results) => {
        // console.log('DATA FOR ', request.body.city);
        seedNewCity(results.data.businesses)
          .then(() => {
            queryCity()
              .then((cityResults) => {
                // console.log('DENVER ', cityResults);
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
    const data = sampleData.massagedDataYelp.businesses;
    // retrieve from db
    // send to client
    response.send();
  }
});


app.post('/book', (req, res) => {
  // Route for booking a reservation

  // req.body should contain a reservation id, and phone number

  // add phone number to reservation and update DB in three spots:
  // 1) create the customer in the customers table if they don't already exist
  // 2A) update reservation in reservations table to show as booked
  // 2B) while also assigning the customer id appropriately

  res.send();
});

app.put('/cancel', (req, res) => {
  // Route for canceling a reservation (updating records)

  // req.body should contain a reservation id

  // remove phone number from reservation

  res.send();
});


app.get('/phone', (req, res) => {
  // Route for getting reservations for phone number

  // req.body sould contain phone number

  // query db for all reservations linked to PN

  // send back array of reservaitons

  res.send();
});

app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
