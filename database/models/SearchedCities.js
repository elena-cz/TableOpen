const bookshelf = require('../index').bookshelf;

const SearchedCity = bookshelf.Model.extend({
  tableName: 'searched_cities',
  byId(id) {
    return this.forge().query({ where: { id } }).fetch();
  },
});

module.exports = bookshelf.model('SearchedCity', SearchedCity);