const bookshelf = require('../index').bookshelf;
const Reservation = require('./Reservations');
const Comment = require('./Comments');

const Restaurant = bookshelf.Model.extend({
  tableName: 'restaurants',
  byId(id) {
    return this.forge().query({ where: { id } }).fetch();
  },
  reservation() {
    return this.hasMany('Reservation', 'restaurant_id');
  },
  comment() {
    return this.hasMany('Comment', 'customer_id');
  },
});

module.exports = bookshelf.model('Restaurant', Restaurant);
