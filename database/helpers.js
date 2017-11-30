const bookshelf = require('./index').bookshelf;
const Restaurant = require('./models/Restaurants');
const Reservation = require('./models/Reservations');

const addCustomerToDataBase = (name, phone) => {
  const customer = new db.Customer();
  customer.set('name', name);
  customer.set('phone', phone);

  customer.save().then(user => user);
};

const grabCustomerById = id => db.Customer.byId(id);

const addRestaurantToDataBase = (name, category, address, city, state, zip, phone, url, image, review_count, rating) => {
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
  };
  return Restaurant.forge(data).save().then(restaurant => restaurant);
};

const addReservationToDatabase = (restaurant_id, isReservationBooked, party_size, customer_id, time) => {
  const reservation = new Reservation();
  const data = { restaurant_id, isReservationBooked, party_size, customer_id, time };
  return Reservation.forge(data).save().then(reservation => reservation);
};

module.exports = {
  addCustomerToDataBase,
  grabCustomerById,
  addRestaurantToDataBase,
  addReservationToDatabase,
};
