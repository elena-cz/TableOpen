import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'underscore';
import { Switch, Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Search from './Search.jsx';
import AvailableReservations from './AvailableReservations.jsx';
import Myreservations from './Myreservations.jsx';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      times: [],
      partySizes: [],
      categories: [],
      myReservations: [],
      phoneNumber: '',
      restaurant: '',
      time: 'All',
      party: 'All',
      category: 'All',
      currUserName: '',
      currUserProfile: '',
    };
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onFilterSubmitClick = this.onFilterSubmitClick.bind(this);
    this.onPhoneNumberSubmitClick = this.onPhoneNumberSubmitClick.bind(this);
    this.onCitySubmitClick = this.onCitySubmitClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onRestaurantSubmitClick = this.onRestaurantSubmitClick.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
  }

  componentDidMount() {
    axios.get('/facebookData')
      .then((results) => {
        console.log('RESULTS', results.data.currUserName);
        this.setState({
          currUserName: results.data.currUserName,
          currUserProfile: results.data.currUserProfile,
        })
      })
      .catch((err) => {
        console.log('Error getting results', err);
      });
  }

  componentWillMount() {
    const self = this;
    axios.get('/data')
      .then((results) => {
        let timeData = {};
        let partySizeData = {};
        let categoryData = {};

        // Funnels all data into a corresponding object to remove duplicates
        _.forEach(results.data, (restaurant) => {
          _.forEach(restaurant.times, (time) => {
            timeData[time] = time;
          });

          _.forEach(restaurant.partySizes, (size) => {
            partySizeData[size] = size;
          });

          _.forEach(restaurant.categories, (cat) => {
            categoryData[cat] = cat;
          });
        });


        timeData = ['All'].concat(Object.keys(timeData).sort((a, b) => {
          // Change two strings of times into numbers so we can easily compare them
          // Ex: a = '5:00 PM' -> time1 = 500
          //     b = '6:30 PM' -> time2 = 630
          let time1 = a.split(' PM').join('').split(':');
          time1 = (time1[0] * 100) + time1[1];

          let time2 = b.split(' PM').join('').split(':');
          time2 = (time2[0] * 100) + time2[1];

          return parseInt(time1, 10) - parseInt(time2, 10);
        }));
        partySizeData = ['All'].concat(Object.keys(partySizeData).sort());
        categoryData = ['All'].concat(Object.keys(categoryData).sort());

        self.setState({
          data: results.data,
          times: timeData,
          partySizes: partySizeData,
          categories: categoryData,
        });
      }).catch((err) => {
        throw err;
      });
  }


  onStateChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onPhoneNumberSubmitClick(phoneNumber) {
    // console.log(phoneNumber, typeof phoneNumber);
    const self = this;
    axios.post('/user', { phoneNumber })
      .then((userReservations) => {
        // console.log(`userReservations: ${JSON.stringify(userReservations, null, 2)}`);
        const myReservations = [];

        userReservations.data.forEach((reservation) => {
          myReservations.push({
            id: reservation.id,
            time: reservation.time.split('\"').join(''),
            party: reservation.party_size,
            restaurant: reservation.name,
          });
        });

        self.setState({
          myReservations
        });
      })
      .catch((err) => {
        throw err;
      });
    // query db for reservations with this phone number
  }

  onCitySubmitClick(city) {
    console.log(city);
    const self = this;
    axios.post('/city', { city })
      .then((results) => {
        self.setState({
          data: results.data
        });
      })
      .catch((err) => {
        throw err;
      });

    // use api to retrieve new data for the city or restaurant
  }

  onRestaurantSubmitClick(restaurant) {
    this.setState({
      restaurant
    });
  }

  onFilterSubmitClick(time, party, category) {
    // filter avaiable restaurants
    this.setState({
      time,
      party,
      category,
    });
  }


  onAcceptClick(reservation, restaurant) {
    // send data to db and repopulate my reservation list
    const myReservations = this.state.myReservations.slice(0);
    myReservations.push({
      id: reservation.id,
      time: reservation.time,
      party: reservation.people,
      restaurant: restaurant,
    });

    const restaurants = this.state.data.slice(0);
    _.forEach(restaurants, (rest) => {
      if (rest.name === restaurant) {
        _.forEach(rest.reservations, (res) => {
          if (res.id === reservation.id) {
            res.booked = true;
          }
        });
      }
    });

    this.setState({
      myReservations,
      data: restaurants
    });

    axios.post('/book', {
      reservationId: reservation.id,
      phoneNumber: this.state.phoneNumber,
    })
      .then(() => console.log('we successfully booked a place!'))
      .catch((err) => {
        throw err;
      });
    // update reservation with a phone number
    // add reservation to myReservations
  }

  onCancelClick(index, reservation) {
    // send data to bd and repopulate my reservation list
    const myReservations = this.state.myReservations.slice(0);
    myReservations.splice(index, 1);

    const restaurants = this.state.data.slice(0);
    _.forEach(restaurants, (rest) => {
      if (rest.name === reservation.restaurant) {
        _.forEach(rest.reservations, (res) => {
          if (res.id === reservation.id) {
            res.booked = false;
          }
        });
      }
    });

    this.setState({
      myReservations,
      data: restaurants
    });

    axios.put('/cancel', {
      reservationId: reservation.id,
    })
      .then(() => console.log('we successfully cancelled a reservation!'))
      .catch((err) => {
        throw err;
      });
  }

  filterData() {

    // This function creates the datapoints that populate the various dropdown filters
    // Depends on the dataset coming from server

    const filters = {
      times: this.state.time,
      partySizes: this.state.party === 'All' ? 'All' : Number(this.state.party),
      categories: this.state.category,
      name: this.state.restaurant,
    };

    let filteredData = this.state.data.slice(0);

    _.forEach(filters, (filter, key) => {
      if (filter !== 'All' && filter !== '') {
        filteredData = _.filter(filteredData, restaurant =>
          restaurant[key].includes(filter));
      }
    });
    return filteredData;
  }

  render() {
    return (
      <div>
        { (this.state.currUserName.length > 0) ? 
          ( 
          <div>
          <p><a href="/logout">Logout</a></p>
          Welcome {this.state.currUserName} ! 
          <img src={this.state.currUserProfile} /> 
          </div>
          ) : (
          <div>
          <p><a href="/">Login</a></p>
          </div>
          )
        }
        <br/><br/>
        <Search
          phoneNumber={this.state.phoneNumber}
          times={this.state.times}
          partySizes={this.state.partySizes}
          categories={this.state.categories}
          onPhoneNumberSubmitClick={this.onPhoneNumberSubmitClick}
          onCitySubmitClick={this.onCitySubmitClick}
          onFilterSubmitClick={this.onFilterSubmitClick}
          onRestaurantSubmitClick={this.onRestaurantSubmitClick}
          onStateChange={this.onStateChange}
          facebookLocation = {this.state.currLocation}
        />
        <div className="main">
          <AvailableReservations
            restaurantData={this.filterData()}
            onAcceptClick={this.onAcceptClick}
            time={this.state.time}
            party={this.state.party}
          />
          <Myreservations
            reservations={this.state.myReservations}
            onCancelClick={this.onCancelClick} 
          />
        </div>
      </div>
    );
  }
}