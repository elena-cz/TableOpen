import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'underscore';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';
import pink from 'material-ui/colors/pink';
import indigo from 'material-ui/colors/indigo';
import red from 'material-ui/colors/red';
import TopMenu from './components/TopMenu';
import Search from './components/Search';
import AvailableReservations from './components/AvailableReservations';
import Myreservations from './components/Myreservations';
import Loader from './components/Refresh';
import Confirmation from './components/ConfirmationPage';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import SignUp from './components/SignUp';
// Global theme

const theme = createMuiTheme({
  palette: {
    // primary: pink['800'],
    primary: {
      ...pink,
      500: '#ad1457',
    },
    secondary: {
      ...indigo,
      A700: '#304ffe',
    },
    error: red,
  },
});


class App extends React.Component {
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
    };
    this.onAcceptClick = this.onAcceptClick.bind(this);
    this.onFilterSubmitClick = this.onFilterSubmitClick.bind(this);
    this.onPhoneNumberSubmitClick = this.onPhoneNumberSubmitClick.bind(this);
    this.onSearchSubmitClick = this.onSearchSubmitClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
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
          myReservations,
        });
      })
      .catch((err) => {
        throw err;
      });
    // query db for reservations with this phone number
  }

  onSearchSubmitClick(city, partySize) {
    console.log(partySize);
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
      data: restaurants,
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
      const restaurantInfo = allInfo;
      const categories = restaurantInfo.category;
      const restaurantName = restaurantInfo.name.toLowerCase().trim();

      return (
        (category === 'All' || categories === category &&
        (restaurant === '' || restaurantName.includes(restaurant.toLowerCase().trim())))
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
    if (this.state.isLoading) {
      return (
        <MuiThemeProvider theme={theme}>
        <TopMenu />
        <Loader />
      </MuiThemeProvider>
      );
    }
    if (this.state.restaurant.length !== 0) {
      return ( 
      <MuiThemeProvider theme={theme}>
      <TopMenu />
      <Confirmation reservation = {this.state.reservation} restaurant={this.state.restaurant} />
      </MuiThemeProvider>
      );
    }
    return (
     <MuiThemeProvider theme={theme}>
      <Router>
      <div>
        <TopMenu />
        <Route exact path='/' component={LoginPage} />
        <Route path='/home' component={Home}/>
        <Route path='/signup' component={SignUp}/>
      </div>
      </Router>
     </MuiThemeProvider>
    )
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
