const bookshelf = require('../index').bookshelf;
const Reservation = require('./Reservations');


const Restaurant = bookshelf.Model.extend({
  tableName: 'restaurants',
  byId(id) {
    return this.forge().query({ where: { id } }).fetch();
  },
  reservation() {
    return this.belongsTo('Reservation');
  },
});


module.exports = bookshelf.model('Restaurant', Restaurant);
