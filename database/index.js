const knex = require('knex')({
  client: 'postgres',
  connection: {
    host: '127.0.0.1',
    user: '',
    password: '',
    database: 'tableopen',
  },
});

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

module.exports = {
  bookshelf,
  knex,
};

