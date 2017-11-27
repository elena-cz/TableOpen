const postgres = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/tableopen';

const client = new postgres.Client({
  connectionString,
  // ssl: true
});

client.connect();

// create schema for restaurants
client.query('DROP TABLE restaurants');
client.query(`
  CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  zip VARCHAR(255),
  url VARCHAR(255),
  image VARCHAR(255),
  phone VARCHAR(255),
  review_count INT,
  rating DECIMAL)`);

// create schema for reservations
client.query('DROP TABLE reservations');
client.query(`
  CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  restaurant_id INT,
  time VARCHAR(255),
  party_size INT,
  customer_id INT DEFAULT NULL,
  isReservationBooked BOOLEAN DEFAULT FALSE)`);

// create schema for customers
client.query('DROP TABLE customers');
client.query(`
  CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(255))`);

module.exports = {
  client,
};
