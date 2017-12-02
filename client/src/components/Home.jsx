import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'underscore';

import { withStyles } from 'material-ui/styles';
import { Switch, Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Search from './Search.jsx';
import AvailableReservations from './AvailableReservations.jsx';
import Myreservations from './Myreservations.jsx';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      times: ['', '5:00pm', '5:30pm', '6:00pm', '6:30pm', '7:00pm', '7:30pm', '8:00pm', '8:30pm', '9:00pm'],
      partySizes: [2, 4, 6, 8],
      categories: ['All'],
      myReservations: [],
      phoneNumber: '',
      restaurant: '',
      time: 'All',
      party: 2,
      category: 'All',
      selectedRestaurant: [],
      currUserName: '',
      currUserProfile: '',
    };
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onFilterSubmitClick = this.onFilterSubmitClick.bind(this);
    this.onPhoneNumberSubmitClick = this.onPhoneNumberSubmitClick.bind(this);
    // this.onCitySubmitClick = this.onCitySubmitClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    // this.onRestaurantSubmitClick = this.onRestaurantSubmitClick.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onSearchSubmitClick = this.onSearchSubmitClick.bind(this);
  }

  componentDidMount() {
    axios.get('/facebookData')
      .then((results) => {
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


  onSearchSubmitClick(city, partySize) {
    console.log(partySize);
    const self = this;
    axios.post('/city', { city })
      .then((results) => {
        if (results) {
          axios.post('/reservations', { city, partySize }).then((restaurants) => {
            let categories = [];
            restaurants.data.forEach((restaurant) => {
              categories.push(restaurant.category);
            });
            categories = _.uniq(['All', ...categories]);
            this.setState({
              data: restaurants.data,
              categories,
              party: partySize,
            });
          }).then(() => {
            console.log('Data', this.state.data);
          })
            .catch((err) => {
              throw err;
            });
        }
      });
  }

  onPhoneNumberSubmitClick(phoneNumber) {
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

  onFilterSubmitClick(time, party, category) {
    // filter avaiable restaurants
    this.setState({
      time,
      party,
      category,
    });
  }

  onAcceptClick(reservationTime, restaurant) {
    // send data to db and repopulate my reservation list
    const myReservations = this.state.myReservations.slice(0);
    myReservations.push({
      // id: reservation.id,
      time: reservationTime,
      party: this.state.party,
      restaurant,
    });

    // Commenting out until we update how we handle booked reservations

    // const restaurants = this.state.data.slice(0);
    // _.forEach(restaurants, (rest) => {
    //   if (rest.name === restaurant) {
    //     _.forEach(rest.reservations, (res) => {
    //       if (res.id === reservation.id) {
    //         res.booked = true;
    //       }
    //     });
    //   }
    // });

    // this.setState({
    //   myReservations,
    //   data: restaurants
    // });

    // axios.post('/book', {
    //   reservationId: reservation.id,
    //   phoneNumber: this.state.phoneNumber,
    // })
    //   .then(() => console.log('we successfully booked a place!'))
    //   .catch((err) => {
    //     throw err;
    //   });
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

  filterRestaurants() {
    // This function creates the datapoints that populate the various dropdown filters
    // Depends on the dataset coming from server

    const {
      data, time, party, category, restaurant,
    } = this.state;


    // let filteredData =  [...data];

    const filteredData = _.filter([...data], (allInfo) => {
      const restaurantInfo = allInfo[0];
      const categories = restaurantInfo.categories.map(cat => cat.title);
      const restaurantName = restaurantInfo.name.toLowerCase().trim();

      return (
        (category === 'All' || categories.includes(category)) &&
        (restaurant === '' || restaurantName.includes(restaurant.toLowerCase().trim()))
      );
    });

    // const filters = {
    //   times: time,
    //   // partySizes: (party === 'All') ? 'All' : Number(party),
    //   categories: category,
    //   name: restaurant,
    // };

    // let filteredData =  [...data];

    // _.forEach(filters, (filter, key) => {
    //   if (filter !== 'All' && filter !== '') {
    //     filteredData = _.filter(filteredData, restaurant =>
    //       restaurant[key].includes(filter));
    //   }
    // });
    return filteredData;
  }


  render() {
    const { classes } = this.props;
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
          categories={this.state.categories}
          onPhoneNumberSubmitClick={this.onPhoneNumberSubmitClick}
          onSearchSubmitClick={this.onSearchSubmitClick}
          onFilterSubmitClick={this.onFilterSubmitClick}
          onStateChange={this.onStateChange}
        />
        <AvailableReservations
          restaurantData={this.filterRestaurants()}
          onAcceptClick={this.onAcceptClick}
          time={this.state.time}
          party={this.state.party}
        />
        <Myreservations
          reservations={this.state.myReservations}
          onCancelClick={this.onCancelClick}
        />
      </div>
    );
  }
}


export default withStyles(styles)(Home);
