const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { client } = require('../database/index.js');
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

const passport = require('passport');
// Requirements for Facebook passport authentication
const FacebookStrategy = require('passport-facebook').Strategy;
// Requirements for local passport authentication
var Strategy = require('passport-local').Strategy;

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

//These parameters are communicated with client
let currUserName = '';
let currUserProfile = '';
let currEmail = '';
let currFriends = '';
let currType = 'customer';
let currPassword = '';

app.get('/facebookData', (req, res) => {
  res.send({currUserName: currUserName, currUserProfile: currUserProfile});
});
 
app.post('/typeof', jsonParser, (req, res) => {
  currType = req.body.type;
  res.end();
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(session({ secret: 'anything', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

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
  let city = req.body.city.split(',')[0];
  city = city.slice(0, 1).toUpperCase() + city.slice(1, city.length).toLowerCase();
  city = city.split(' ');
  if (city.length > 1) {
    var formattedCity = `${city[0]} ${city[1].slice(0, 1).toUpperCase() + city[1].slice(1, city[1].length)}`;
    console.log(formattedCity);
  } else {
    var formattedCity = city.join(' ');
    console.log(formattedCity);    
  }
  queryDatabaseForCity(formattedCity, req.body.partySize).then((data) => {
    res.status(200);
    res.send(JSON.stringify(data));
  });
});

//helper function that checks if user is authenticated
const authenticated =  (req, res, next) =>{
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/home');
}

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/dist/index.html'));    
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/dist/index.html'));    
});


//Use Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: '1599506193439803',
    clientSecret: '3503ebf58772e5335ab25bd5e8b352f5',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'emails', 'displayName', 'picture', 'address', 'friends'],
  },
  function(accessToken, refreshToken, profile, done) {
    //Check customers table for anyone with a Facebook ID of profile.id
    currUserName = profile.displayName;
    currUserProfile = profile.photos[0].value;
    currEmail = profile._json.email;
    currFriends = profile._json.friends;
    client.query(`SELECT * FROM customers WHERE facebook_id = '${profile.id}';`, function(err, user) {
      if (err) {
          return done(err);
      }
      //If no user is found, create a new user with values from Facebook
      if (user.rowCount === 0) {
        client.query(`INSERT INTO customers (email, name, user_type, facebook_id) VALUES ('${profile._json.email}', '${profile.displayName}', '${currType}', '${profile.id}');`, function(err, data) {
          done(null, user);
          if (err) {
            console.log('error entering customer into database');
            return done(err);
          }
        });
      } else {
        client.query(`UPDATE customers SET user_type = '${currType}');`, function(err, data) {
          if(err) {
            console.log('error updating records');
          }
          console.log(data);
        });
      done(null, user);
    }
    });
  })
);

//// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback

app.get('/auth/facebook', passport.authenticate('facebook',  {scope: ['email', 'user_friends']}));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/',
    successRedirect: '/home',
    scope: ['email', 'user_friends']}
    )                         
);

//serializeUser determines which data of the user object should be stored in the session
passport.serializeUser(function(user, done) {
  done(null, user);
});

//deserializeUser retrieves user object with help of id key
passport.deserializeUser(function(user, done) {
  done(null, user);
});

//Passport local strategy
passport.use('local', new Strategy(
  function(username, password, done) {
   currUserName = username;
   client.query(`SELECT * FROM customers WHERE email = '${username}' AND password = '${password}';`, (err, user) => {if (err) {
          return done(err);
        }
      if(user.rowCount === 0) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }
)}));

passport.use('local-signup', new Strategy({
    passReqToCallback: true,
    session: false
  },
  function(req, username, password, done) {
    currUserName = req.body.name;
    client.query(`INSERT INTO customers (email, name, password, user_type) VALUES ('${username}', '${req.body.name}', '${password}', '${req.body.usertype[0]}');`, function(err, user) {
        if (err) {
          console.log('error entering customer into database');
          return done(err);
        }
        return done(null, user);
      });
 }));

app.post('/newuser', urlencodedParser, 
   passport.authenticate('local-signup', { failureRedirect: '/signup', successRedirect: '/home'})
);

app.post('/loginpassport', urlencodedParser, passport.authenticate('local',
  { successRedirect: '/home', failureRedirect: '/' })
);

//responds to logout request
app.get('/logout', function(req, res) {
  req.logout();
  currUserName = '';
  currUserProfile = '';
  res.redirect('/');
});

// initialize the database with a yelp query for 1000 SF restaurants
// seedDatabase();

// const visitedCities = ['San Francisco, CA'];

// App will initially load with SF as the default city
app.get('/data', (request, response) => {
  queryDatabaseForCity()
    .then(cityResults => response.send(formatCityResults(cityResults)))
    .catch((err) => {
      throw err;
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
