import React, { Component } from 'react';
import Swap from '../swap/Swap';
import Market from '../market/Market';

class Body extends Component {
  render() {
    return (
      <div className={"body"}>
        <div className={"container"}>
          <div className={"body__title"}>No Deposit, No Orderbook, Competitive Spreads</div>
          <div className={"body__sub-title"}>A simple way to exchange tokens. Over 70 tokens supported</div>
          <Swap/>
          <Market/>
        </div>
      </div>
    )
  }
}

export default Body;
