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

const styles = theme => ({
  error: {
    color: 'grey',
    fontStyle: 'italic',
  },
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
    opacity: 1.0,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: theme.palette.text.secondary,
    width: '40%',
    paddingBottom: 40,
  },
});

class LoginError extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      showPassword: false,
    };
  }

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
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
      <br /><br /><br /><br />
      <Paper className={classes.paper} elevation={2}>
      <form method="post" action="/loginpassport">
      <div className={classes.error}>Incorrect username and password 
      </div>
      <TextField 
        id="username" 
        className={classes.textField}
        name="username" 
        placeholder="Username"
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
      <br></br>
       <Button
        type="submit"
        raised color="primary"
        className={classes.button}
       >
       Login
       </Button>
    </form>
      <Button
        type="submit"
        raised color="accent"
        className={classes.button}
        href="/auth/facebook"
       >
      Login with Facebook
      </Button>
      <br></br>
      - or -
      <br></br>
      <Button
        type="submit"
        raised color="primary"
        className={classes.button}
        href="/signup"
       >
      Sign up
      </Button>
      </Paper>
      </div>
    );
  }
}


export default withStyles(styles)(LoginError);
