import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'underscore';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import pink from 'material-ui/colors/pink';
import indigo from 'material-ui/colors/indigo';
import red from 'material-ui/colors/red';
import Search from './Search';
import AvailableReservations from './AvailableReservations';
import MyReservations from './Myreservations';
import Loader from './Refresh';
import Confirmation from './ConfirmationPage';
import Button from 'material-ui/Button';

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
      reservationFilter: 'HIDE',
      phoneNumber: '',
      restaurant: '',
      time: 'All',
      party: 2,
      category: 'All',
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
        console.log(results);
        this.setState({
          currUserProfile: results.data,
        });
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
          myReservations,
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

  onConfirmationClick(input) {
    const data = {
      reservation: this.state.reservation,
      customerId: this.state.currUserProfile.id,
      comment: input,
    };
    this.setState({
      reservation: [],
      restaurant: ' ',
    });
    axios.post('/updateReservations', data)
      .then(result => console.log(result));
  }

  onCancelClick(id) {
    // send data to bd and repopulate my reservation list
    axios.put('/cancel', {id}).then((result) => {
      this.setState({
        reservationFilter: 'HIDE',
        myReservations: [],
      });
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

  myClick() {
    this.setState({
      isLoading: true,
    });
    axios.post('/getReservations', this.state.currUserProfile)
      .then((result) => {
        this.setState({
          isLoading: false,
          reservationFilter: 'SHOW',
          myReservations: result.data,
        });
      });
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
          <Confirmation reservation={this.state.reservation} restaurant={this.state.restaurant} confirmationClick={this.onConfirmationClick.bind(this)} />
        </MuiThemeProvider>
      );
    }
    if (this.state.reservationFilter === 'SHOW') {
      return (
        <MuiThemeProvider theme={theme}>
          <MyReservations reservations={this.state.myReservations} onCancelClick={this.onCancelClick.bind(this)} />
        </MuiThemeProvider>
      );
    }
    return (
      <MuiThemeProvider theme={theme}>
        <Button
          onClick={this.myClick.bind(this)}
          raised
          color="accent"
          className={classes.button}
        >
          My Reservations
        </Button>
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
      </MuiThemeProvider>
    );
  }
}


export default withStyles(styles)(Home);
