const db = require('./index');

const addCustomerToDataBase = (name, phone) => {
  const customer = new db.Customer();
  customer.set('name', name);
  customer.set('phone', phone);

  customer.save().then(user => user);
};

const grabCustomerById = id => db.Customer.byId(id);

const addRestaurantToDataBase = (name, category, address, city, state, zip, phone, review_count, rating) => {
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
  };
  db.Restaurant.forge(data).save().then(restaurant => restaurant);
};

const addReservationToDatabase = (restaurant_id, isReservationBooked) => {
  const reservation = new db.Reservation();
  const data = { restaurant_id, isReservationBooked: false };
  db.Reservation.forge(data).save().then(reservation => reservation);
};

module.exports = {
  addCustomerToDataBase,
  grabCustomerById,
  addRestaurantToDataBase,
  addReservationToDatabase,
};
