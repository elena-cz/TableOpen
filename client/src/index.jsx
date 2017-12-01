import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import _ from 'underscore';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Search from './components/Search.jsx';
import AvailableReservations from './components/AvailableReservations.jsx';
import Myreservations from './components/Myreservations.jsx';
import LoginPage from './components/LoginPage.jsx';
import Home from './components/Home.jsx';
import SignUp from './components/SignUp.jsx';

class App extends React.Component {
  render() {
    return (
      <Router>
      <div>
        <Route exact path='/' component={LoginPage} />
        <Route path='/home' component={Home}/>
        <Route path='/signup' component={SignUp}/>
      </div>
      </Router>
    )
  }
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
