import React from 'react';
import axios from 'axios';

export default class SignUp extends React.Component{

  constructor(props) {
  	super(props);
  	this.state = {
      type: '',
  	};
  }

  handleFBChange(event) {
	axios.post('/typeof', {type: event.target.value})
      .then((results) => {
      	console.log('sent to server typeof FB user')
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  render(){
    return(
      <div>
      <div>Sign Up Page</div>
      <br></br>
      <form method="post" action="/newuser">
      Username:
      <input type="text" name="username" placeholder="Email"/>
      <br></br>
      Password:
      <input type="password" name="password"/>
      <br></br>
      Name:
      <input type="text" name="name"/>
      <br></br>
      Type of User:
      <select name="usertype"> 
	    <option value="customer">Customer</option>
	    <option value="restaurant">Restaurant Manager</option>
	  </select>
	  <br></br>
	  <input type="submit" value="Submit" />
	  <br></br>
	  <br></br>
	  <a href="/auth/facebook"> Sign up with Facebook</a>
	  <br></br>
      Type of User:
      <select name="usertype" value={this.state.type} onChange={this.handleFBChange}> 
	    <option value="customer">Customer</option>
	    <option value="restaurant">Restaurant Manager</option>
	  </select>
	  <br></br>
	  </form>
      </div>
    );
  }
}