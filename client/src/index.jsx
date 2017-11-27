import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'underscore';
import Search from './components/Search.jsx';
import AvailableReservations from './components/AvailableReservations.jsx';
import Myreservations from './components/Myreservations.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      times: [],
      partySizes: [],
      categories: [],
      myReservations: [],
      phoneNumber: '',
      time: 'All',
      party: 'All',
      category: 'All',
      restaurant: ''
    };
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onFilterSubmitClick = this.onFilterSubmitClick.bind(this);
    this.onPhoneNumberSubmitClick = this.onPhoneNumberSubmitClick.bind(this);
    this.onCitySubmitClick = this.onCitySubmitClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onRestaurantSubmitClick = this.onRestaurantSubmitClick.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
  }

  componentWillMount() {
    const self = this;
    axios.get('/data')
      .then((res) => {
        let timeData = {};
        let partySizeData = {};
        let categoryData = {};

        // Funnels all data into a coresponding object to remove duplicates
        // found
        _.forEach(res.data, (restaurant) => {
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

        timeData = ['All'].concat(Object.keys(timeData));
        partySizeData = ['All'].concat(Object.keys(partySizeData));
        categoryData = ['All'].concat(Object.keys(categoryData));

        // Sets state to
        self.setState({
          data: res.data,
          times: timeData,
          partySizes: partySizeData,
          categories: categoryData,
        });
      }).catch((err) => {
        throw err;
      });
  }


  onStateChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      // console.log(this.state);
    });
  }

  onPhoneNumberSubmitClick(phoneNumber) {
    console.log(phoneNumber);
    const self = this;
    axios.get('/user', { phoneNumber })
      .then((res) => {
        self.setState({
          myReservations: res.data
        });
      })
      .catch((err) => {
        throw err;
      });
    // query db for reservations with this phone number
  }

  onCitySubmitClick(restaurant, city) {
    console.log(restaurant, city);
    const self = this;
    axios.post('data/city', { city })
      .then((res) => {
        self.setState({
          data: res.data
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

    // console.log(time, party, category);
  }


  onAcceptClick(reservation, restaurant) {
    // send data to db and repopulate my reservation list
    const myReservations = this.state.myReservations.slice(0);
    myReservations.push({
      id: reservation.id,
      time: reservation.time,
      party: reservation.people,
      restaurant: restaurant
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
    // update reservation and remove phonenumber on it
    // remove reservation from myReservations
    // re-query db for all available reservations
  }

  filterData() {
    // console.log(this.state.data);

    // Object used to simplify the filtering process
    // Keys are properties located on each restaurant object
    // recieved from server
    // Values are the search by terms provided by the user

    const filters = {
      times: this.state.time,
      partySizes: this.state.party === 'All' ? 'All' : Number(this.state.party),
      categories: this.state.category,
      name: this.state.restaurant
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
        />
        <div className="main">
          <AvailableReservations
            restaurantData={this.filterData()}
            onAcceptClick={this.onAcceptClick}
            time={this.state.time}
            party={this.state.party}
          />
          <Myreservations reservations={this.state.myReservations}
            onCancelClick={this.onCancelClick} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
