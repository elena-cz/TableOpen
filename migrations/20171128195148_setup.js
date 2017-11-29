exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('restaurants', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('category');
    table.string('address');
    table.string('city');
    table.string('state');
    table.string('zip');
    table.string('phone');
    table.integer('review_count');
    table.decimal('rating', 2);
  }).createTable('customers', (table) => {
    table.increments('id').primary();
    table.string('phone');
    table.string('name');
  }).createTable('reservations', (table) => {
    table.increments('id').primary();
    table.integer('restaurant_id').unique().references('restaurants.id');
    table.boolean('isReservationBooked');
    table.integer('party_size');
    table.string('time');
    table.integer('customer_id').unique().references('customers.id');
  }),
]);

exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('restaurants')
  .dropTable('reservations')
  .dropTable('customer'),
]);
