import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'underscore';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';
import pink from 'material-ui/colors/pink';
import indigo from 'material-ui/colors/indigo';
import red from 'material-ui/colors/red';


import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Search from './components/Search.jsx';
import AvailableReservations from './components/AvailableReservations.jsx';
import Myreservations from './components/Myreservations.jsx';
import LoginPage from './components/LoginPage.jsx';
import Home from './components/Home.jsx';
import SignUp from './components/SignUp.jsx';
import TopMenu from './components/TopMenu';
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

  render() {
    const { classes } = this.props;
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
