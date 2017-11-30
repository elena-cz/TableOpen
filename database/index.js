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
bookshelf.plugin('registry');

module.exports = {
  bookshelf,
  knex,
};

