import React from 'react';

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      restaurant: '',
    };
  }

  onSubmit() {

  }

  onChange() {

  }
  render() {
    return (
      <div>
        <div className="confirmation" />
        <h3> Please confirm your reservation for { date_time } at { restaurant } for { party_size } </h3>
        <form onSubmit={this.handleSubmit} >
          <label>
          Please enter any special accomodations here:
            <textarea value={this.state.input} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Confirmation;
