const bookshelf = require('./index').bookshelf;
const Restaurant = require('./models/Restaurants');
const Reservation = require('./models/Reservations');
const SearchedCity = require('./models/SearchedCities');
const Customer = require('./models/Customers');
const Comment = require('./models/Comments');
// returns a customer given their Facebook ID
const grabCustomerByFbId = id => Customer.forge().query({ where: { facebook_id: id } }).fetch();

// adds a customer logging in by Facebook to the database
const addFbCustomerToDataBase = (email, name, user_type, facebook_id) => {
  const data = {
    email,
    name,
    user_type,
    facebook_id,
  };
  return Customer.forge(data).save().then(customer => customer);
};

// returns a customer given their username (email)
const grabCustomerById = (id, password) => Customer.forge().query({ where: { email: id, password } }).fetch();

// adds a non-Facebook customer to the database
const addCustomerToDataBase = (email, name, password, user_type) => {
  const data = {
    email,
    name,
    password,
    user_type,
  };
  return Customer.forge(data).save().then(customer => customer);
};

// updates a customer's choice of user type by Facebook ID
const updateFbUserType = (id, usertype) => Customer.forge().where({ facebook_id: id }).save({ user_type: usertype }, { patch: true }).then(results => results);

const updateReservation = (customer_id, id) => Reservation.forge().where({ id }).save({ customer_id, isReservationBooked: true }, { patch: true }).then((results => results));

const createComment = (comments, restaurant_id, customer_id, reservation_id) => {
  const data = {
    comments,
    restaurant_id,
    customer_id,
    reservation_id,
  };
  return Comment.forge(data).save().then(results => results);
};

const addCityToDatabase = (city) => {
  const data = {
    city,
  };
  return SearchedCity.forge(data).save().then(result => result);
};
// adds restaurant to the database

const addRestaurantToDataBase = (name, category, address, city, state, zip, phone, url, image, review_count, rating, floorplan) => {
  const data = {
    name,
    category,
    address,
    city,
    state,
    zip,
    phone,
    review_count,
    rating,
    url,
    image,
    floorplan,
  };
  return Restaurant.forge(data).save().then(restaurant => restaurant);
};

// Gets restaurant and it's reservations by ID
const grabRestaurantReservationsById = id => Restaurant.forge().query({ where: { id } }).fetch({ withRelated: ['reservation'] }).then(result => result);

// Gets restaurant and it's reservations by ID
const grabRestaurantByName = name => Restaurant.forge().query({ where: { name } }).fetch().then(result => result);

// adds reservation to the database
const addReservationToDatabase = (restaurant_id, isReservationBooked, party_size, customer_id, time, coordinates) => {
  const data = {
    restaurant_id, isReservationBooked, party_size, customer_id, time, coordinates,
  };
  return Reservation.forge(data).save().then(reservation => reservation);
};

const grabReservationsByCustomerId = customer_id => Reservation.query({ where: { customer_id } }).fetchAll({ withRelated: ['restaurant'] }).then(results => results);

const cancelReservation = id => Reservation.forge().where({ id }).save({ customer_id: null, isReservationBooked: false }, { patch: true }).then(results => results);

module.exports = {
  addFbCustomerToDataBase,
  grabCustomerByFbId,
  updateFbUserType,
  addCustomerToDataBase,
  grabCustomerById,
  addRestaurantToDataBase,
  addReservationToDatabase,
  addCityToDatabase,
  updateReservation,
  createComment,
  grabReservationsByCustomerId,
  cancelReservation,
  grabRestaurantReservationsById,
  grabRestaurantByName,
  updateReservation,
  createComment,
  grabReservationsByCustomerId,
  cancelReservation,
};
