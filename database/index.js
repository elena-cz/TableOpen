const postgres = require('pg');

const knex = require('knex')({
  client: 'postgres',
  connection: {
    host: '127.0.0.1',
    user: 'luisalvarez',
    password: 'scooby225',
    database: 'tableopen',
  },
});

const bookshelf = require('bookshelf')(knex);

const Customer = bookshelf.Model.extend(
  {
    tableName: 'customers',
  },
  {
    byId(id) {
      return this.forge().query({ where: { id } }).fetch();
    },
  }
);

const Restaurant = bookshelf.Model.extend(
  {
    tableName: 'restaurants',
  },
  {
    byId(id) {
      return this.forge().query({ where: { id } }).fetch();
    },
  }
);

//comma dangle does causes issue when run
const Reservation = bookshelf.Model.extend(
  {
    tableName: 'reservations',
  },
  {
    byId(id) {
      return this.forge().query({ where: { id } }).fetch();
    },
  }
);

module.exports = {
  bookshelf,
  knex,
  Customer,
  Restaurant,
  Reservation,
};

