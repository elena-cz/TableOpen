const bookshelf = require('../index').bookshelf;

const Customer = bookshelf.Model.extend({
  tableName: 'customers',
  byId(id) {
    return this.forge().query({ where: { id } }).fetch();
  },
});


module.exports = bookshelf.model('Customer', Customer);