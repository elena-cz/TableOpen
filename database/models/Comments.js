const bookshelf = require('../index').bookshelf;
const Restaurant = require('./Restaurants');
const Customer = require('./Customers');
const Reservation = require('./Reservations');

const Comment = bookshelf.Model.extend({
  tableName: 'comments',
  byId(id) {
    return this.forge().query({ where: { id } }).fetch();
  },
  restaurant() {
    return this.belongsTo('Restaurant');
  },
  customer() {
    return this.belongsTo('Customer');
  },
  reservation() {
    return this.belongsTo('Reservation');
  },
});

module.exports = bookshelf.model('Comment', Comment);