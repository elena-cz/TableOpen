import React from 'react';
import axios from 'axios';

import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

const styles = theme => ({
  body: {
    position: 'absolute',
    background: 'url("http://www.domainedefontenille.com/image/images_site/33/le-champ-des-lunes-restaurant-gastronomique-au-coeur-du-luberon-fond-background.jpg")',
    backgroundSize: 'contain',
    opacity: 0.5,
    width: '81%',
    height: '80vh',
    zIndex: -1,
  },
  container: {
    display: 'block',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    width: 250,
  },
  button: {
    margin: theme.spacing.unit,
    width: 250,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: theme.palette.text.secondary,
    width: '40%',
    marginTop: 10,
    paddingBottom: 20,
  },
  formControl: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
    margin: theme.spacing.unit,
    width: 250,
    textAlign: 'left',
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class SignUp extends React.Component{

  constructor(props) {
  	super(props);
    this.state = {
      password: '',
      showPassword: false,
      usertype: '',
      fbtype: '',
    };
  }

  handleFBChange(event) {
   if(this.state.fbtype === 'restaurant') {
    axios.post('/typeof', {type: this.state.fbtype})
      .then((results) => {
        console.log('sent to server typeof FB user')
      })
      .catch((err) => {
        console.log('Error', err);
      });
   }
  }

 handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPasssword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render(){

    const { classes } = this.props;

    return(
      <div>
        <Grid className={classes.body} />
        <br />
        <Paper className={classes.paper} elevation={2}>
        <form method="post" action="/newuser">
        <TextField 
          id="username" 
          className={classes.textField}
          name="username" 
          placeholder="Email"
          margin="normal"
        />
        <br />
        <TextField
          id="name"
          className={classes.textField}
          name="name"
          placeholder="Name"
          margin="normal"
        />
        <br />
        <Input
          id="password"
          label="Password"
          className={classes.textField}
          name="password"
          placeholder="Password"
          margin="normal"

          type={this.state.showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={this.handleClickShowPasssword}
                onMouseDown={this.handleMouseDownPassword}
              >
                {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <br />
        
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="age-simple">Type of User</InputLabel>
          <Select
            name="usertype"
            value={this.state.usertype}
            onChange={this.handleChange}
            input={<Input name="usertype" id="age-simple" />}
          >
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="restaurant">Restaurant Manager</MenuItem>
          </Select>
        </FormControl>

  	  <br></br>
      <Button
        type="submit"
        raised color="primary"
        className={classes.button}
       >
       Sign Up
       </Button>
  	  <br></br>
      - or -
      <br></br>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">Type of User</InputLabel>
        <Select
          name="fbtype"
          value={this.state.fbtype}
          onChange={this.handleChange}
          onMouseOver={this.handleFBChange.bind(this)}
          input={<Input name="fbtype" id="age-simple" />}
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="restaurant">Restaurant Manager</MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        raised color="accent"
        className={classes.button}
        href="/auth/facebook"
        onClick={this.handleFBChange}
       >
      Sign up with Facebook
      </Button>


  	  </form>
      </Paper>
      </div>
    );
  }
}


export default withStyles(styles)(SignUp);