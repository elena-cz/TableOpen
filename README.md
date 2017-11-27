# TableOpen

> An OpenTable clone. Search for available reservations at restaurants across the US and book (or cancel) reservations online. Filter available restaurants and their available reservations based on restaurant category, reservation times, and party size capacity. Manage reservations by typing in your phone number, and your existing reservations will populate on the right-hand side of the screen. You will receive a confirmation text upon booking/cancelling a reservation.

## Team

  - Bernard Kitchens
  - Nick Gratzick
  - Vlad Tretyakov
  - Chadam Miller

## Table of Contents

1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [Development](#development)
    1. [Installing Dependencies and Startup](#installing-dependencies)
4. [Roadmap](#roadmap)
5. [Contributing](#contributing)

## Usage

> Search for available reservations at restaurants across the US and book (or cancel) reservations online. Filter available restaurants and their available reservations based on restaurant category, reservation times, and party size capacity. Manage reservations by typing in your phone number, and your existing reservations will populate on the right-hand side of the screen. You will receive a confirmation text upon booking/cancelling a reservation.

## Requirements

- Node 8.6.x
- React 16.1.x
- Postgresql 7.4.0
- Jasmine
- Yelp, Twilio

## Development

### Installing Dependencies and Startup

From within the root directory:

Download and install the latest version of Postgres.
Create a Postgres database with UTF-8 encoding on your machine.

Navigate to the project directory.

For first-time users:
```sh
npm install
npm run db-init-first-time
npm run react-dev
npm run server
```

After your initial set-up, you can now use the 'db-start' command to kickstart the database:
```sh
npm run db-start
npm run react-dev
npm run server
```

Finally, note that only one instance of Postgres can be running at once, so if you get a connection error when trying to start up the database, use the following command:
```sh
npm run db-stop
```
...then re-run the database start command: 
```sh
npm run db-start
```


### Roadmap

View the project roadmap [here](LINK_TO_DOC)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
