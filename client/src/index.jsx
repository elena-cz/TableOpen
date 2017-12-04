import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import pink from 'material-ui/colors/pink';
import indigo from 'material-ui/colors/indigo';
import red from 'material-ui/colors/red';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import SignUp from './components/SignUp';
import TopMenu from './components/TopMenu';
import LoginError from './components/Error';
import OwnerPortal from './components/OwnerPortal';
import MyReservations from './components/Myreservations';

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
      A700: '#3b5998',
    },
    error: red,
  },
});


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currUserName: '',
      currUserProfile: '',
      showReservations: false,
    };
    this.myClick = this.myClick.bind(this);
  }

  myClick() {
    this.setState({
      showReservations: true,
    });
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div>
            <TopMenu myClick={this.myClick} />
            <Route exact path="/" component={LoginPage} />
            <Route
              path="/home"
              render={routeProps => (
                <Home showReservations = {this.state.showReservations} />
  )}
            />
            <Route path="/manager" component={OwnerPortal} />
            <Route path="/signup" component={SignUp} />
            <Route path="/error" component={LoginError} />
            <Route path="/reservations" component={MyReservations}/>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
