const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { 
  grabCustomerByFbId,
  addFbCustomerToDataBase,
  updateFbUserType,
  addCustomerToDataBase,
  grabCustomerById,
  updateReservation,
  createComment,
  grabReservationsByCustomerId,
  cancelReservation,
  grabRestaurantByName,
  grabRestaurantReservationsById,
  updateReservation,
  createComment,
  grabReservationsByCustomerId,
  cancelReservation,
} = require('../database/helpers.js');
// const { client } = require('../database/index.js');
// const twilio = require('../helpers/twilioApi.js');
const { getRestaurantsByCity } = require('../helpers/yelpApi.js');
const {
  queryDatabaseForCity,
  saveNewCityData,
  generateReservationTimes,
  getCustomerReservations,
  bookReservation,
  alreadySearched,
  saveNewRestaurant,
  getRestaurantReservationsByTime,
  saveRestaurantReservationsByTime,
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



app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(session({ secret: 'anything', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/../client/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/typeof', jsonParser, (req, res) => {
 currType = req.body.type;
 res.end();
});

app.get('/facebookData', (req, res) => {
  res.status(200);
  res.send(req.user);
});

app.post('/updateReservations', (req, res) => {
  console.log(req.body);
  updateReservation(req.body.customerId, req.body.reservation.id).then((result) => {
    return createComment(req.body.comment, req.body.reservation.restaurant_id, req.body.customerId, req.body.reservation.id)
  }).then((result) => {
    res.status(200);
    res.send(result);
  });
});

app.post('/getReservations', (req, res) => {
  grabReservationsByCustomerId(req.body.id).then((result) => {
    res.status(200);
    res.send(result);
  });
});

app.post('/typeof', jsonParser, (req, res) => {
  currType = req.body.type;
  res.end();
});
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
  } else {
    var formattedCity = city.join(' ');    
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

app.get('/reservations', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/dist/index.html'));    
});

app.get('/manager', (req, res) => {
  res.sendFile(path.join(__dirname, '/../client/dist/index.html'));    
});


app.get('/error', (req, res) => {
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
    grabCustomerByFbId(profile.id)
      .then(user => {
        console.log('Results', user.toJSON());
        if(!user) {
          addFbCustomerToDataBase(profile._json.email, profile.displayName, currType, profile.id)
            .then(user => done(null, user))
            .catch(err => done(err));
        } else {
          updateFbUserType(profile.id, currType)
            .then(user => done(null, user))
            .catch(err => done(err));
        }
      })
      .catch(err => {
        return done(err);
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
   grabCustomerById(username, password)
    .then( user => {
      if(!user) {
        return done(null, false);
      } else {
        currUserName = user.attributes.name;
        return done(null, user);
      }
    })
    .catch(err => {
      return done(err);
    });
}));

passport.use('local-signup', new Strategy({
    passReqToCallback: true,
    session: false
  },
  function(req, username, password, done) {
    currUserName = req.body.name;
    addCustomerToDataBase(username, req.body.name, password, req.body.usertype)
    .then(user => {
      return done(null, user);
    })
    .catch(err => {
      return done(err);
    })
 }));

app.post('/newuser', urlencodedParser, 
   passport.authenticate('local-signup', { failureRedirect: '/signup', successRedirect: '/home'})
);

app.post('/loginpassport', urlencodedParser, passport.authenticate('local',
  { successRedirect: '/home', failureRedirect: '/error' })
);

//responds to logout request
app.get('/logout', function(req, res) {
  req.logout();
  currUserName = '';
  currUserProfile = '';
  res.redirect('/');
});

app.put('/cancel', (req, res) => {
  console.log('cancel');
  cancelReservation(req.body.id).then((result) => {
    res.status(200);
    res.send(true);
  });
});

// app.post('/user', (req, res) => {
//   getCustomerReservations(req.body.phoneNumber)
//     .then(results => res.send(results.rows));
// });

// Owner portal routes

app.post('/restaurants', (request, response) => {
  saveNewRestaurant(request.body)
    .then(results => response.send(results.rows));
});

app.post('/restaurants/:restaurantId/reservations', (request, response) => {
  saveRestaurantReservationsByTime(request.params.restaurantId, request.body.floorplan)
    .then(results => response.send(results));
});

app.get('/restaurants/:restaurantId/reservations', (request, response) => {
  return grabRestaurantReservationsById(request.params.restaurantId)
    .then(results => response.send(results));
});

app.get('/restaurant/:name', (request, response) => {
  grabRestaurantByName(request.params.name)
    .then(results => response.send(results));
});


app.listen(PORT, () => console.log(`The TableOpen server is listening on port ${PORT}!`));
