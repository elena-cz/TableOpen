const bookshelf = require('../index').bookshelf;
const Reservation = require('./Reservations');
const Comment = require('./Comments');

const Customer = bookshelf.Model.extend({
  tableName: 'customers',
  byId(id) {
    return this.forge().query({ where: { id } }).fetch();
  },
  byFBID(id) {
    return this.forge().query({ where: { 'facebook_id': id } }).fetch();
  },
  reservation() {
    return this.hasMany('Reservation', 'customer_id');
  },
  comment() {
    return this.hasMany('Comment', 'customer_id');
  },
});

module.exports = bookshelf.model('Customer', Customer);