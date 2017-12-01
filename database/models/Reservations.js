const bookshelf = require('../index').bookshelf;
const Restaurant = require('./Restaurants');
const Customer = require('./Customers');

const Reservation = bookshelf.Model.extend({
  tableName: 'reservations',
  byId(id) {
    return this.forge().query({ where: { id } }).fetch();
  },
  restaurant() {
    return this.belongsTo('Restaurant');
  },
  customer() {
    return this.hasMany('Customer', 'id');
  },
});

module.exports = bookshelf.model('Reservation', Reservation);
