import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'underscore';
import { withStyles } from 'material-ui/styles';
import { Switch, Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import Search from './Search.jsx';
import AvailableReservations from './AvailableReservations.jsx';
import Myreservations from './Myreservations.jsx';
import Avatar from 'material-ui/Avatar';
import classNames from 'classnames';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  avatar: {
    margin: 5,
    marginLeft: 10,
  },
  bigAvatar: {
    width: 45,
    height: 45,
  },
  row: {
    display: 'inline-flex',
    justifyContent: 'left',
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
      isLoading: false,
      reservation: [],
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
  onStateChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }


  onSearchSubmitClick(city, partySize) {
    this.setState({ isLoading: true });
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
            this.setState({ isLoading: false });
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

  onFilterSubmitClick(time, restaurant, category) {
    // filter avaiable restaurants
    this.setState({
      time,
      restaurant,
      category,
    });
  }

  onAcceptClick(res, rest) {
    this.setState({
      reservation: res,
      restaurant: rest,
    });
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
    const {
      data, time, party, category, restaurant,
    } = this.state;

    const filteredData = _.filter([...data], (allInfo) => {
      const restaurantInfo = allInfo;
      const categories = restaurantInfo.category;
      const restaurantName = restaurantInfo.name.toLowerCase().trim();

      return (
        (category === 'All' || categories === category &&
        (restaurant === '' || restaurantName.includes(restaurant.toLowerCase().trim())))
      );
    });
    return filteredData;
  }


  render() {
    const { classes } = this.props;
    if (this.state.isLoading) {
      return (
        <MuiThemeProvider theme={theme}>
        <Loader />
      </MuiThemeProvider>
      );
    }
    if (this.state.restaurant.length !== 0) {
      return ( 
      <MuiThemeProvider theme={theme}>
      <Confirmation reservation = {this.state.reservation} restaurant={this.state.restaurant} />
      </MuiThemeProvider>
      );
    }
    return (
      <div>
      <br/>
        { (this.state.currUserName.length > 0) ? 
          ( 
          <div className={classes.row}>
          <br/>
          Welcome {this.state.currUserName}!
          <Avatar
          src={this.state.currUserProfile}
          className={classNames(classes.avatar, classes.bigAvatar)}
          />
          </div>
          ) : (
          <div>
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
