import React from 'react';
import moment from 'moment';

class Myreservation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul>
          <li>Restaurant: {this.props.reservation.restaurant}</li>
          <li>Time: {moment(this.props.reservation.time).format('LT')}</li>
          <li>Party: {this.props.reservation.party}</li>
          <li><button onClick={() => { this.props.cancel(this.props.index, this.props.reservation.id) }} >Cancel</button></li>
        </ul>
      </div>);
  }
}

export default Myreservation;