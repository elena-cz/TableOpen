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
    table.string('url');
    table.string('image');
    table.integer('review_count');
    table.decimal('rating', 2, 1);
    table.text('comments', 'longtext');
    table.text('floorplan', 'longtext');
  }).createTable('customers', (table) => {
    table.increments('id').primary();
    table.string('phone');
    table.string('name');
    table.string('email').unique();
    table.string('password');
    table.string('user_type');
    table.string('facebook_id');
  }).createTable('reservations', (table) => {
    table.increments('id').primary();
    table.integer('restaurant_id').references('restaurants.id');
    table.boolean('isReservationBooked');
    table.integer('party_size');
    table.string('time');
    table.text('coordinates');
    table.integer('customer_id').references('customers.id');
  }).createTable('searched_cities', (table) => {
    table.increments('id').primary();
    table.string('city');
  }).createTable('comments', (table) => {
    table.increments('id').primary();
    table.text('comments', 'longtext');
    table.integer('restaurant_id').references('restaurants.id');
    table.integer('customer_id').references('customers.id');
    table.integer('reservation_id').references('reservations.id');
  }),
]);

exports.down = (knex, Promise) => Promise.all([knex.schema.dropTable('restaurants')
  .dropTable('reservations')
  .dropTable('customers'),
]);
