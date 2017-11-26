import React from 'react';

class Myreservation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul>
          <li>Restaurant: </li>
          <li>Time: </li>
          <li>Party: </li>
          <li><button onClick={() => { this.props.cancel(this.props.index, this.props.reservation.id) }} >Cancel</button></li>
        </ul>
      </div>);
  }
}

export default Myreservation;